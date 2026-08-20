'use client'

import React from 'react'
import { StructuredResume } from '@/types'
import { ResumePreview } from '@/components/ResumePreview'
import { X, Sparkles } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Vista Previa & Descargas</h3>
              <p className="text-[11px] text-slate-400">Currículum optimizado listo para postulación</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Cerrar vista previa"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-hidden p-2 sm:p-4 bg-slate-950">
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
