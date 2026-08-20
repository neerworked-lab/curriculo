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
import { Eye, Sparkles, Activity } from 'lucide-react'

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'orchestrator',
      text: `¡Hola! Soy **Alex**, tu asesor y agente de IA para la creación y optimización de tu Currículum Vitae.

Puedes **adjuntar tu CV actual (Word o PDF)**, subir una foto de perfil y escribirme tus metas para comenzar. ¿En qué te puedo ayudar hoy?`,
      timestamp: new Date().toISOString()
    }
  ])

  const [structuredResume, setStructuredResume] = useState<StructuredResume | null>(null)
  const [findings, setFindings] = useState<AgentFinding[]>([])
  const [activeAgentId, setActiveAgentId] = useState<AgentId | null>(null)
  const [activeAgentStatusText, setActiveAgentStatusText] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Multi-device persistence restore on initial load
  useEffect(() => {
    const savedEmail = localStorage.getItem('user_session_email') || null
    if (savedEmail) {
      setUserEmail(savedEmail)
      const savedSession = localStorage.getItem(`curriculo_session_${savedEmail}`)
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession)
          if (parsed.messages && parsed.messages.length > 0) setMessages(parsed.messages)
          if (parsed.structuredResume) setStructuredResume(parsed.structuredResume)
          if (parsed.findings) setFindings(parsed.findings)
        } catch {}
      }
    }
    setIsAuthChecking(false)
  }, [])

  // Auto-save session across changes
  useEffect(() => {
    if (userEmail) {
      const stateToSave = {
        messages,
        structuredResume,
        findings,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(`curriculo_session_${userEmail}`, JSON.stringify(stateToSave))
    }
  }, [userEmail, messages, structuredResume, findings])

  const handleLoginSuccess = (email: string, name?: string, photo?: string) => {
    setUserEmail(email)
    localStorage.setItem('user_session_email', email)
    if (name) localStorage.setItem('user_session_name', name)
    if (photo) localStorage.setItem('user_session_photo', photo)

    const savedSession = localStorage.getItem(`curriculo_session_${email}`)
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession)
        if (parsed.messages && parsed.messages.length > 0) setMessages(parsed.messages)
        if (parsed.structuredResume) setStructuredResume(parsed.structuredResume)
        if (parsed.findings) setFindings(parsed.findings)
      } catch {}
    }
  }

  const handleSignOut = () => {
    setUserEmail(null)
    localStorage.removeItem('user_session_email')
  }

  // Upload parser handler: Only parse and attach, do NOT auto-trigger pipeline
  const handleUploadFile = async (file: File): Promise<Attachment | null> => {
    try {
      const parsed = await parseUploadedFile(file)
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

  // Complete Sequential 4-Agent Pipeline Execution with Visual Step Illuminations
  const handleTriggerPipeline = async (
    rawText: string,
    targetRole?: string,
    photoUrl?: string,
    userInstructions?: string
  ) => {
    setIsProcessing(true)

    const addAgentLog = (agentName: string, text: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `step-${Date.now()}-${Math.random()}`,
          sender: 'orchestrator',
          text: `⚡ **${agentName}:** ${text}`,
          timestamp: new Date().toISOString()
        }
      ])
    }

    try {
      // Step 1: The Diagnoser
      setActiveAgentId('diagnoser')
      setActiveAgentStatusText('Auditando estructura, cédula y compatibilidad ATS...')
      addAgentLog('The Diagnoser', 'Escaneando estructura completa del CV original y calculando métricas de compatibilidad ATS...')
      await new Promise((r) => setTimeout(r, 1200))

      // Step 2: The Recruiter
      setActiveAgentId('recruiter')
      setActiveAgentStatusText('Optimizando impacto visual en 6 segundos y densidad de palabras clave...')
      addAgentLog('The Recruiter', 'Analizando jerarquía visual para selector humano y alineación de términos clave...')
      await new Promise((r) => setTimeout(r, 1200))

      // Step 3: The Hiring Manager
      setActiveAgentId('hiring_manager')
      setActiveAgentStatusText('Cuantificando responsabilidades y liderazgo bajo Google XYZ...')
      addAgentLog('The Hiring Manager', 'Elevando el impacto de la trayectoria laboral y cargos institucionales bajo la metodología Google XYZ...')
      await new Promise((r) => setTimeout(r, 1200))

      // Step 4: The Rewriter
      setActiveAgentId('rewriter')
      setActiveAgentStatusText('Maquetando el diseño original en 2 columnas y puliendo la redacción...')
      addAgentLog('The Rewriter', 'Generando la versión ejecutiva final con la plantilla original de 2 columnas, foto y datos completos...')

      const combinedText = userInstructions
        ? `[INSTRUCCIONES DEL USUARIO]:\n${userInstructions}\n\n[DOCUMENTOS ADJUNTOS]:\n${rawText}`
        : rawText

      const result = await runCompleteAgentPipeline({
        resumeRawText: combinedText,
        targetRole,
        photoUrl
      })

      setFindings(result.findings)
      setStructuredResume(result.finalResume)
      setActiveAgentId(null)
      setActiveAgentStatusText('')

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
      setActiveAgentStatusText('')
    }
  }

  // Conversational Chat & Submission handler
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

    // Collect all attached documents and photos
    let extractedDocText = ''
    let photoUrl: string | undefined = undefined

    attachments?.forEach((att) => {
      if (att.content && att.type !== 'image') {
        extractedDocText += `\n--- Archivo: ${att.name} ---\n${att.content}\n`
      }
      if (att.type === 'image' && att.url) {
        photoUrl = att.url
      }
      if (att.url && !photoUrl) {
        photoUrl = att.url
      }
    })

    // If documents are attached, trigger complete 4-agent transformation
    if (extractedDocText.trim().length > 10) {
      await handleTriggerPipeline(extractedDocText, undefined, photoUrl, text)
      return
    }

    // Standard interactive conversation with Alex
    setIsProcessing(true)
    try {
      const historyForApi = [...messages, userMsg].map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: m.text
      }))

      const data = await runOrchestratorChat({
        messages: historyForApi,
        extractedFileContent: extractedDocText || undefined,
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
          text: `⚠️ Detalle de comunicación: ${err.message}`,
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
        blob = await generateDocxResume(structuredResume)
      } else if (format === 'pptx') {
        const uint8 = await generatePptxResume(structuredResume)
        blob = new Blob([uint8 as unknown as BlobPart], {
          type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        })
      } else {
        const targetElement = document.getElementById('resume-printable-sheet')
        const uint8 = await generatePdfResume(structuredResume, targetElement)
        blob = new Blob([uint8 as unknown as BlobPart], { type: 'application/pdf' })
      }

      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeName = (structuredResume.personalInfo?.fullName || 'curriculum')
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

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!userEmail) {
    return <AuthScreen onLoginSuccess={handleLoginSuccess} />
  }

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

        {/* 2. Floating "Ver Currículum" button when resume is ready */}
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
              <span>Ver Vista Previa & Diseños</span>
            </button>
          </div>
        )}

        {/* 3. Main Workspace Grid */}
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

          {/* Desktop Right Sidebar: 4 Specialized Agents Panel with Active Illumination */}
          <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 h-full min-h-0 flex-col bg-slate-950/80 rounded-2xl border border-slate-800/80 p-3 overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  Panel de Agentes IA
                </h3>
              </div>
              {activeAgentId ? (
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold animate-pulse flex items-center gap-1">
                  <Activity className="w-2.5 h-2.5 animate-spin" />
                  Procesando
                </span>
              ) : (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                  4 Activos
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              <AgentStatusCard
                findings={findings}
                activeAgentId={activeAgentId}
                isRunningPipeline={isProcessing}
                isVerticalSidebar={true}
              />
            </div>

            {structuredResume && (
              <button
                onClick={() => setIsPreviewOpen(true)}
                className="mt-3 w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                <span>Abrir Diseños & Descargas</span>
              </button>
            )}
          </div>

        </div>
      </main>

      {/* Full Screen Resume Preview & Exporter Modal */}
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
