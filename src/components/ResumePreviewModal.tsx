'use client'

import React from 'react'
import { StructuredResume } from '@/types'
import { ResumePreview } from '@/components/ResumePreview'
import { X, Sparkles, ArrowLeft, MessageSquare } from 'lucide-react'

interface ResumePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  resume: StructuredResume | null
  onDownload: (format: 'pdf' | 'docx' | 'pptx') => Promise<void>
  isDownloading: boolean
}

export const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({
  isOpen,
  onClose,
  resume,
  onDownload,
  isDownloading
}) => {
  if (!isOpen || !resume) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-6xl h-[95vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
              title="Volver a chatear con Alex"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver al Chat</span>
            </button>
            <div className="border-l border-slate-800 pl-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Vista Previa & Galería de Diseños</span>
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400">
                Selecciona tu plantilla favorita y descarga en cualquier formato
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/20 transition-all flex items-center gap-1 text-xs font-bold"
            title="Cerrar y continuar editando"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden p-2 sm:p-4 bg-slate-950 min-h-0">
          <ResumePreview
            resume={resume}
            onDownload={onDownload}
            isDownloading={isDownloading}
          />
        </div>
      </div>
    </div>
  )
}
