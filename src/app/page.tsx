'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { AgentStatusCard } from '@/components/AgentStatusCard'
import { ChatInterface } from '@/components/ChatInterface'
import { ResumePreviewModal } from '@/components/ResumePreviewModal'
import { AuthScreen } from '@/components/AuthScreen'
import { ChatMessage, Attachment, StructuredResume, AgentFinding, AgentId } from '@/types'
import { runOrchestratorChat, runCompleteAgentPipeline } from '@/lib/gemini'
import { generateDocxResume } from '@/lib/exporters/wordExporter'
import { generatePptxResume } from '@/lib/exporters/pptxExporter'
import { generatePdfResume } from '@/lib/exporters/pdfExporter'
import { parseUploadedFile } from '@/lib/parsers/documentParser'
import { Eye, FileText, Sparkles, ShieldCheck } from 'lucide-react'

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'orchestrator',
      text: `¡Hola! Soy **Alex**, tu asesor y agente de IA para la creación y optimización de tu Currículum Vitae.

Puedes **arrastrar y soltar tu CV actual (PDF o Word)**, subir una foto de perfil, o simplemente contarme tus objetivos profesionales para comenzar. ¿En qué te puedo ayudar hoy?`,
      timestamp: new Date().toISOString()
    }
  ])

  const [structuredResume, setStructuredResume] = useState<StructuredResume | null>(null)
  const [findings, setFindings] = useState<AgentFinding[]>([])
  const [activeAgentId, setActiveAgentId] = useState<AgentId | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    const savedEmail = localStorage.getItem('user_session_email') || null
    if (savedEmail) {
      setUserEmail(savedEmail)
    }
    setIsAuthChecking(false)
  }, [])

  const handleLoginSuccess = (email: string, name?: string, photo?: string) => {
    setUserEmail(email)
    localStorage.setItem('user_session_email', email)
    if (name) localStorage.setItem('user_session_name', name)
    if (photo) localStorage.setItem('user_session_photo', photo)
  }

  const handleSignOut = () => {
    setUserEmail(null)
    localStorage.removeItem('user_session_email')
  }

  // Upload parser handler
  const handleUploadFile = async (file: File): Promise<Attachment | null> => {
    try {
      const parsed = await parseUploadedFile(file)

      if (parsed.fileType === 'pdf' || parsed.fileType === 'docx' || (parsed.fileType === 'text' && parsed.text)) {
        setTimeout(() => {
          handleTriggerPipeline(parsed.text, undefined, parsed.photoUrl)
        }, 300)
      }

      return {
        name: file.name,
        type: parsed.fileType,
        size: file.size,
        content: parsed.text,
        url: parsed.photoUrl
      }
    } catch (err: any) {
      alert(`Error al procesar archivo: ${err.message}`)
      return null
    }
  }

  // Complete 4-Agent Pipeline Execution
  const handleTriggerPipeline = async (rawText: string, targetRole?: string, photoUrl?: string) => {
    setIsProcessing(true)
    setActiveAgentId('diagnoser')

    const pipelineMsgId = `pipeline-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: pipelineMsgId,
        sender: 'orchestrator',
        text: `⏳ He recibido tu currículum. Activando el panel de agentes en cascada:
1. 🔍 **The Diagnoser** está escaneando la estructura y calculando el Score ATS...
2. 🎯 **The Recruiter** está analizando el filtro de 6 segundos y keywords...
3. 💼 **The Hiring Manager** está cuantificando logros bajo el formato Google XYZ...
4. ✍️ **The Rewriter** está puliendo la redacción final...`,
        timestamp: new Date().toISOString()
      }
    ])

    try {
      const result = await runCompleteAgentPipeline({
        resumeRawText: rawText,
        targetRole,
        photoUrl
      })

      setFindings(result.findings)
      setStructuredResume(result.finalResume)
      setActiveAgentId(null)

      setMessages((prev) => [
        ...prev,
        {
          id: `summary-${Date.now()}`,
          sender: 'orchestrator',
          text: result.orchestratorSummary,
          timestamp: new Date().toISOString(),
          structuredResume: result.finalResume
        }
      ])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'orchestrator',
          text: `⚠️ Error al procesar con los agentes: ${err.message}`,
          timestamp: new Date().toISOString()
        }
      ])
    } finally {
      setIsProcessing(false)
      setActiveAgentId(null)
    }
  }

  // Conversational Chat with Orchestrator
  const handleSendMessage = async (text: string, attachments?: Attachment[]) => {
    if (!text && (!attachments || attachments.length === 0)) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
      attachments
    }

    setMessages((prev) => [...prev, userMsg])
    setIsProcessing(true)

    let extractedText: string | undefined = undefined
    let photoUrl: string | undefined = undefined

    attachments?.forEach((att) => {
      if (att.content && att.type !== 'image') {
        extractedText = (extractedText ? extractedText + '\n\n' : '') + att.content
      }
      if (att.type === 'image' && att.url) {
        photoUrl = att.url
      }
    })

    try {
      const historyForApi = [...messages, userMsg].map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: m.text
      }))

      const data = await runOrchestratorChat({
        messages: historyForApi,
        extractedFileContent: extractedText,
        photoUrl
      })

      if (data.structuredResume) {
        setStructuredResume(data.structuredResume)
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `orch-${Date.now()}`,
          sender: 'orchestrator',
          text: data.text,
          timestamp: new Date().toISOString(),
          structuredResume: data.structuredResume
        }
      ])
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'orchestrator',
          text: `⚠️ Hubo un detalle de comunicación con la IA: ${err.message}`,
          timestamp: new Date().toISOString()
        }
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  // Export Download Trigger
  const handleDownload = async (format: 'pdf' | 'docx' | 'pptx') => {
    if (!structuredResume) return
    setIsDownloading(true)
    try {
      let blob: Blob

      if (format === 'docx') {
        const buffer = await generateDocxResume(structuredResume)
        blob = new Blob([new Uint8Array(buffer)], {
          type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        })
      } else if (format === 'pptx') {
        const buffer = await generatePptxResume(structuredResume)
        blob = new Blob([new Uint8Array(buffer)], {
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        })
      } else {
        const buffer = generatePdfResume(structuredResume)
        blob = new Blob([new Uint8Array(buffer)], { type: 'application/pdf' })
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeName = (structuredResume.personalInfo.fullName || 'curriculum')
        .toLowerCase()
        .replace(/\s+/g, '_')
      a.download = `${safeName}_resume.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      alert(`Error al descargar: ${err.message}`)
    } finally {
      setIsDownloading(false)
    }
  }

  // Prevent flash while checking auth
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  // Auth Gate: If user is not logged in, show AuthScreen
  if (!userEmail) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />
  }

  // Main Studio Application
  return (
    <div className="h-[100dvh] bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 overflow-hidden">
      <Navbar
        userEmail={userEmail}
        onSignOut={handleSignOut}
        splitView={false}
        onToggleSplitView={() => {}}
        hasActiveResume={Boolean(structuredResume)}
      />

      <main className="flex-1 max-w-[1600px] w-full mx-auto p-2 sm:p-4 flex flex-col gap-2.5 overflow-hidden min-h-0">
        
        {/* 1. Mobile Top Agents Banner (Only visible on mobile screens) */}
        <div className="lg:hidden shrink-0">
          <AgentStatusCard
            findings={findings}
            activeAgentId={activeAgentId}
            isRunningPipeline={isProcessing}
            isVerticalSidebar={false}
          />
        </div>

        {/* 2. Floating / Sticky "Ver Currículum" button when resume is ready */}
        {structuredResume && (
          <div className="shrink-0 flex items-center justify-between px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 shadow-lg animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-300 font-mono">
                Currículum Optimizado Disponible
              </span>
              {structuredResume.atsScore && (
                <span className="hidden sm:inline text-[11px] text-slate-400 font-mono">
                  (ATS Score: {structuredResume.atsScore.overall}%)
                </span>
              )}
            </div>

            <button
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Vista Previa & Descargas</span>
            </button>
          </div>
        )}

        {/* 3. Main Workspace Grid: Wide Chat on Left, 4 Agents Vertical Panel on Right in Desktop */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3.5 min-h-0 overflow-hidden">
          
          {/* Main Wide Chat with Alex */}
          <div className="lg:col-span-8 xl:col-span-9 h-full min-h-0 transition-all duration-300">
            <ChatInterface
              messages={messages}
              onSendMessage={handleSendMessage}
              onUploadFile={handleUploadFile}
              isProcessing={isProcessing}
              onTriggerPipeline={handleTriggerPipeline}
              onQuickDownload={handleDownload}
              hasActiveResume={Boolean(structuredResume)}
            />
          </div>

          {/* Desktop Right Sidebar: 4 Specialized Agents Panel */}
          <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 h-full min-h-0 flex-col bg-slate-950/80 rounded-2xl border border-slate-800/80 p-3 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Panel de Agentes IA
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                4 Activos
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              <AgentStatusCard
                findings={findings}
                activeAgentId={activeAgentId}
                isRunningPipeline={isProcessing}
                isVerticalSidebar={true}
              />
            </div>

            {/* Quick Preview trigger button in sidebar */}
            {structuredResume && (
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Abrir Vista Previa del CV</span>
              </button>
            )}
          </div>

        </div>
      </main>

      {/* Full Screen Resume Preview & Multi-Format Exporter Modal */}
      <ResumePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        resume={structuredResume}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />
    </div>
  )
}
