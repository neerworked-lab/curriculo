'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChatMessage, Attachment } from '@/types'
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  FileText,
  Sparkles,
  Loader2,
  Download,
  UploadCloud,
  Trash2,
  PlusCircle,
  RefreshCw,
  Mic,
  MicOff
} from 'lucide-react'

interface ChatInterfaceProps {
  messages: ChatMessage[]
  onSendMessage: (text: string, attachments?: Attachment[]) => Promise<void>
  onUploadFile: (file: File) => Promise<Attachment | null>
  isProcessing: boolean
  onTriggerPipeline: (rawText: string, targetRole?: string) => Promise<void>
  onQuickDownload: (format: 'pdf' | 'docx' | 'pptx') => void
  hasActiveResume: boolean
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onUploadFile,
  isProcessing,
  onQuickDownload
}) => {
  const [inputText, setInputText] = useState('')
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isRecording, setIsRecording] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<any>(null)

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isProcessing])

  // Auto-resize textarea like Antigravity
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, 40), 160)}px`
    }
  }, [inputText])

  const isRecordingRef = useRef(false)

  // Speech to text initialization (Continuous mode like Antigravity)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = 'es-ES'

        recognition.onresult = (event: any) => {
          let currentTranscript = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              const text = event.results[i][0].transcript
              setInputText((prev) => (prev ? `${prev} ${text}` : text))
            }
          }
        }

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition notice:', err)
        }

        recognition.onend = () => {
          // If the user hasn't explicitly stopped recording, auto-restart continuous listening
          if (isRecordingRef.current) {
            try {
              recognition.start()
            } catch {}
          } else {
            setIsRecording(false)
          }
        }

        recognitionRef.current = recognition
      }
    }
  }, [])

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no tiene activado el dictado por voz directo. Puedes escribir normalmente.')
      return
    }

    if (isRecording) {
      isRecordingRef.current = false
      recognitionRef.current.stop()
      setIsRecording(false)
    } else {
      try {
        isRecordingRef.current = true
        recognitionRef.current.start()
        setIsRecording(true)
      } catch {
        isRecordingRef.current = false
        setIsRecording(false)
      }
    }
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if ((!inputText.trim() && attachments.length === 0) || isProcessing) return

    // Stop recording if active when sending
    if (isRecording && recognitionRef.current) {
      isRecordingRef.current = false
      recognitionRef.current.stop()
      setIsRecording(false)
    }

    const textToSend = inputText
    const attachmentsToSend = [...attachments]

    setInputText('')
    setAttachments([])

    if (textareaRef.current) {
      textareaRef.current.style.height = '40px'
    }

    await onSendMessage(textToSend, attachmentsToSend)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const att = await onUploadFile(file)
      if (att) {
        setAttachments((prev) => [...prev, att])
      }
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
      if (photoInputRef.current) photoInputRef.current.value = ''
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const att = await onUploadFile(file)
      if (att) {
        setAttachments((prev) => [...prev, att])
      }
    } finally {
      setIsUploading(false)
    }
  }

  const quickPrompts = [
    {
      label: 'Crea un Currículum Vitae nuevo',
      icon: PlusCircle,
      prompt: 'Hola Alex, quiero crear un Currículum Vitae nuevo desde cero. Por favor guíame paso a paso.'
    },
    {
      label: 'Actualiza Currículum Vitae',
      icon: RefreshCw,
      prompt: 'Hola Alex, quiero actualizar y optimizar mi Currículum Vitae actual para aumentar mi impacto y Score ATS.'
    }
  ]

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`h-full flex flex-col bg-slate-950 rounded-2xl border transition-colors relative overflow-hidden min-h-0 ${
        isDragging ? 'border-emerald-500 bg-emerald-950/20' : 'border-slate-800/80'
      }`}
    >
      {/* Drag overlay notice */}
      {isDragging && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-40 flex flex-col items-center justify-center pointer-events-none text-emerald-400">
          <UploadCloud className="w-12 h-12 sm:w-16 sm:h-16 animate-bounce mb-3" />
          <h4 className="text-base sm:text-lg font-bold">Suelta tu archivo aquí</h4>
          <p className="text-[11px] sm:text-xs text-slate-400">Soporta PDF, Word (.docx) y Fotos (JPG/PNG)</p>
        </div>
      )}

      {/* 1. TOP SCROLLABLE MESSAGES AREA (Independent Scroll) */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3.5 custom-scrollbar min-h-0">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user'
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 text-left ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Agent Avatar */}
              {!isUser && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20 text-slate-950 font-bold text-xs mt-0.5">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[92%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-lg ${
                  isUser
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Sender badge */}
                <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/10 text-[10px] opacity-70">
                  <span className="font-mono uppercase font-semibold">
                    {isUser ? 'Tú' : 'Alex (Asesor IA)'}
                  </span>
                  <span>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Attachments preview inside bubble */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {msg.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/30 border border-white/10 text-[11px] font-mono"
                      >
                        {att.type === 'image' ? (
                          <ImageIcon className="w-3 h-3 text-teal-300" />
                        ) : (
                          <FileText className="w-3 h-3 text-emerald-300" />
                        )}
                        <span className="truncate max-w-[130px]">{att.name}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Text Content - 100% Cleaned of any JSON */}
                <div className="whitespace-pre-wrap space-y-2 text-xs sm:text-sm text-slate-100">
                  {msg.text
                    .replace(/```json[\s\S]*?```/gi, '')
                    .replace(/```[\s\S]*?```/gi, '')
                    .replace(/\{[\s\S]*"personalInfo"[\s\S]*\}/gi, '')
                    .replace(/"photoUrl":\s*"[^"]*",?/gi, '')
                    .trim() || '¡He actualizado tu currículum! Puedes revisarlo en la vista previa a continuación.'}
                </div>

                {/* Interactive Preview & Download Banner inside message */}
                {msg.structuredResume && (
                  <div className="mt-3 pt-3 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-2 bg-slate-950/60 p-2.5 rounded-xl border">
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Currículum Listo en Vista Previa</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onQuickDownload('pdf')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
                        title="Descargar PDF directo"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                      <button
                        onClick={() => onQuickDownload('docx')}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 transition-all shadow-sm"
                        title="Descargar Word directo"
                      >
                        <Download className="w-3 h-3" />
                        <span>Word</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Loading Indicator */}
        {isProcessing && (
          <div className="flex gap-2.5 text-left items-center">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shrink-0 shadow-md text-slate-950">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="px-3.5 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Alex está analizando tu solicitud...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 2. QUICK ACTIONS (2 Buttons) */}
      <div className="p-2 sm:px-4 sm:py-2 bg-slate-950/95 border-t border-slate-900 grid grid-cols-2 gap-1.5 shrink-0 z-10">
        {quickPrompts.map((item, idx) => {
          const Icon = item.icon
          return (
            <button
              key={idx}
              onClick={() => onSendMessage(item.prompt)}
              disabled={isProcessing}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-[10px] sm:text-xs font-medium text-slate-200 transition-colors hover:border-emerald-500/40 disabled:opacity-50 text-center leading-tight truncate shadow-sm"
              title={item.label}
            >
              <Icon className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* 3. ATTACHMENT CHIPS */}
      {attachments.length > 0 && (
        <div className="px-3 pt-1.5 flex flex-wrap gap-1.5 bg-slate-950 shrink-0 z-10">
          {attachments.map((att, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-emerald-300 font-mono"
            >
              {att.type === 'image' ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
              <span className="truncate max-w-[120px]">{att.name}</span>
              <button
                type="button"
                onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                className="p-0.5 hover:text-red-400 ml-0.5"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 4. ANTIGRAVITY-STYLE EXPANDABLE COMPOSER (Textarea on top, 4 Action Buttons below) */}
      <div className="p-2 sm:p-3 bg-slate-950 border-t border-slate-800/80 shrink-0 z-10 sticky bottom-0">
        <div className="bg-slate-900/95 rounded-2xl border border-slate-800 focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/40 transition-all p-2 flex flex-col gap-1.5 shadow-lg">
          
          {/* Hidden inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
          />
          <input
            type="file"
            ref={photoInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* Auto-expanding Textarea */}
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Escribe a Alex o sube tu CV (PDF o Word)..."
            disabled={isProcessing}
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 resize-none text-xs sm:text-sm focus:outline-none custom-scrollbar max-h-[160px] min-h-[38px] px-1.5 py-1 leading-relaxed"
          />

          {/* Bottom Action Bar: [Doc] [Foto] ... [Micrófono] [Enviar] */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
            {/* Left: Attachments (Doc, Photo) */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* 1. Upload Doc */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || isProcessing}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50 flex items-center gap-1 text-[11px] shrink-0"
                title="Subir documento PDF o Word"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                ) : (
                  <Paperclip className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Documento</span>
              </button>

              {/* 2. Upload Photo */}
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={isUploading || isProcessing}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors disabled:opacity-50 flex items-center gap-1 text-[11px] shrink-0"
                title="Subir foto de perfil"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Foto</span>
              </button>
            </div>

            {/* Right: Microphone and Send Button SIDE BY SIDE */}
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              {/* 3. Microphone Button (Directly next to send button) */}
              <button
                type="button"
                onClick={toggleRecording}
                disabled={isProcessing}
                className={`p-2 rounded-xl transition-all flex items-center justify-center shrink-0 ${
                  isRecording
                    ? 'bg-red-500/20 border border-red-500/50 text-red-400 animate-pulse'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
                title={isRecording ? 'Detener dictado' : 'Dictar por voz'}
              >
                {isRecording ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* 4. Send Button */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={(!inputText.trim() && attachments.length === 0) || isProcessing}
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all disabled:opacity-40 disabled:hover:bg-emerald-500 shadow-md shadow-emerald-500/20 flex items-center gap-1 text-xs shrink-0"
                title="Enviar mensaje"
              >
                <span className="hidden sm:inline">Enviar</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
