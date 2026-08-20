'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/Navbar'
import { AgentStatusCard } from '@/components/AgentStatusCard'
import { ChatInterface } from '@/components/ChatInterface'
import { ResumePreview } from '@/components/ResumePreview'
import { AuthScreen } from '@/components/AuthScreen'
import { ChatMessage, Attachment, StructuredResume, AgentFinding, AgentId } from '@/types'
import { runOrchestratorChat, runCompleteAgentPipeline } from '@/lib/gemini'
import { generateDocxResume } from '@/lib/exporters/wordExporter'
import { generatePptxResume } from '@/lib/exporters/pptxExporter'
import { generatePdfResume } from '@/lib/exporters/pdfExporter'
import { parseUploadedFile } from '@/lib/parsers/documentParser'

export default function Home() {
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAuthChecking, setIsAuthChecking] = useState(true)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'orchestrator',
      text: `¡Hola! Soy **The Orchestrator**, el Director Ejecutivo del Estudio Multi-Agente de Currículums.

Estoy aquí junto a nuestro panel de 4 agentes de élite:
- 🔍 **The Diagnoser:** Auditará la estructura, vacíos y calculará tu **Score ATS**.
- 🎯 **The Recruiter:** Evaluará el impacto de los primeros 6 segundos y optimizará las **palabras clave**.
- 💼 **The Hiring Manager:** Reformulará tus logros con la fórmula **Google XYZ** (*Logré X medido por Y haciendo Z*).
- ✍️ **The Rewriter:** Redactará la versión ejecutiva final impecable.

Puedes **arrastrar y soltar tu CV actual (PDF o Word)**, subir una foto de perfil, o simplemente contarme tus objetivos profesionales para comenzar. ¿Qué te gustaría hacer hoy?`,
      timestamp: new Date().toISOString()
    }
  ])

  const [structuredResume, setStructuredResume] = useState<StructuredResume | null>(null)
  const [findings, setFindings] = useState<AgentFinding[]>([])
  const [activeAgentId, setActiveAgentId] = useState<AgentId | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [splitView, setSplitView] = useState(true)

  useEffect(() => {
    const savedEmail = localStorage.getItem('user_session_email') || null
    if (savedEmail) {
      setUserEmail(savedEmail)
    }
    setIsAuthChecking(false)
  }, [])

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email)
    localStorage.setItem('user_session_email', email)
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
      setSplitView(true)

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
        setSplitView(true)
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar
        userEmail={userEmail}
        onSignOut={handleSignOut}
        splitView={splitView}
        onToggleSplitView={() => setSplitView(!splitView)}
        hasActiveResume={Boolean(structuredResume)}
      />

      <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-5 flex flex-col gap-4 overflow-hidden">
        <AgentStatusCard
          findings={findings}
          activeAgentId={activeAgentId}
          isRunningPipeline={isProcessing}
        />

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[580px] h-[calc(100vh-250px)]">
          <div className={`${splitView ? 'lg:col-span-6 xl:col-span-5' : 'lg:col-span-12'} h-full transition-all duration-300`}>
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

          {splitView && (
            <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-full transition-all duration-300">
              <ResumePreview
                resume={structuredResume}
                onDownload={handleDownload}
                isDownloading={isDownloading}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
