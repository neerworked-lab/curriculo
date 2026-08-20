'use client'

import React, { useState } from 'react'
import { StructuredResume } from '@/types'
import {
  Download,
  FileText,
  Presentation,
  Check,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Globe,
  Link as LinkIcon,
  Loader2,
  Share2
} from 'lucide-react'

interface ResumePreviewProps {
  resume: StructuredResume | null
  onDownload: (format: 'pdf' | 'docx' | 'pptx') => Promise<void>
  isDownloading: boolean
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  onDownload,
  isDownloading
}) => {
  const [downloadFormat, setDownloadFormat] = useState<'pdf' | 'docx' | 'pptx'>('pdf')
  const [themeMode, setThemeMode] = useState<'modern' | 'minimal' | 'executive'>('modern')

  if (!resume) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/80">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-400 mb-4 shadow-inner">
          <FileText className="w-8 h-8 opacity-60" />
        </div>
        <h3 className="text-base font-semibold text-slate-300 mb-1">Vista Previa del Currículum</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Sube tu CV actual o chatea con The Orchestrator para que los 4 agentes generen tu currículum optimizado en tiempo real.
        </p>
      </div>
    )
  }

  const { personalInfo, workExperience, education, skills, atsScore } = resume

  return (
    <div className="h-full flex flex-col bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Top Action Bar */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Documento Listo para Exportar
          </h3>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          {/* PDF */}
          <button
            onClick={() => onDownload('pdf')}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-semibold transition-all disabled:opacity-50"
            title="Descargar en PDF ATS-Friendly"
          >
            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5 text-emerald-400" />}
            <span>PDF</span>
          </button>

          {/* Word DOCX */}
          <button
            onClick={() => onDownload('docx')}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 text-xs font-semibold transition-all disabled:opacity-50"
            title="Descargar en Word (.docx editable)"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Word (.docx)</span>
          </button>

          {/* PPTX */}
          <button
            onClick={() => onDownload('pptx')}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-all disabled:opacity-50"
            title="Descargar Presentación (.pptx)"
          >
            <Presentation className="w-3.5 h-3.5 text-amber-400" />
            <span>PowerPoint</span>
          </button>
        </div>
      </div>

      {/* ATS Score Meter Banner */}
      {atsScore && (
        <div className="px-5 py-3 bg-gradient-to-r from-emerald-950/40 via-slate-900/50 to-teal-950/40 border-b border-emerald-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-300 text-sm">
              {atsScore.overall}%
            </div>
            <div>
              <div className="font-semibold text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Score de Compatibilidad ATS Auditado
              </div>
              <p className="text-[11px] text-slate-400">
                Formato: {atsScore.formatting}% · Keywords: {atsScore.keywordMatch}% · Impacto: {atsScore.impactScore}%
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-emerald-400 font-mono bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-500/30">
            ✓ 100% ATS-Proof
          </div>
        </div>
      )}

      {/* Sheet Container (Simulates printed A4 page) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-slate-950">
        <div className="max-w-[760px] mx-auto bg-white text-slate-900 rounded-xl shadow-2xl p-6 sm:p-8 border border-slate-200">
          
          {/* Header */}
          <div className="border-b border-slate-200 pb-5 mb-5 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
                {personalInfo.fullName}
              </h1>
              <p className="text-base font-bold text-teal-700 mt-0.5">
                {personalInfo.title}
              </p>
              
              {/* Contact details */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2.5 font-medium">
                {personalInfo.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-slate-400" /> {personalInfo.email}
                  </span>
                )}
                {personalInfo.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-slate-400" /> {personalInfo.phone}
                  </span>
                )}
                {personalInfo.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {personalInfo.location}
                  </span>
                )}
                {personalInfo.linkedin && (
                  <span className="flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-slate-400" /> {personalInfo.linkedin}
                  </span>
                )}
                {personalInfo.github && (
                  <span className="flex items-center gap-1">
                    <LinkIcon className="w-3 h-3 text-slate-400" /> {personalInfo.github}
                  </span>
                )}
              </div>
            </div>

            {/* Candidate Photo if provided */}
            {personalInfo.photoUrl && (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-teal-600 shadow-md shrink-0">
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Professional Summary */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-600 pb-1 mb-2 font-mono flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-teal-600" /> Perfil Profesional
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
              {personalInfo.summary}
            </p>
          </div>

          {/* Work Experience */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-600 pb-1 mb-3 font-mono flex items-center gap-1.5">
              <Briefcase className="w-3 h-3 text-teal-600" /> Experiencia Profesional
            </h2>
            <div className="space-y-4">
              {workExperience.map((exp) => (
                <div key={exp.id || exp.company}>
                  <div className="flex flex-wrap items-baseline justify-between gap-1">
                    <div className="text-sm font-bold text-slate-900">
                      {exp.role} <span className="text-teal-700 font-semibold">| {exp.company}</span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-500">
                      {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}
                      {exp.location ? ` · ${exp.location}` : ''}
                    </div>
                  </div>
                  <ul className="mt-1.5 space-y-1">
                    {exp.achievements.map((ach, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-relaxed">
                        <span className="text-teal-600 font-bold mt-0.5">•</span>
                        <span>{ach}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-600 pb-1 mb-2.5 font-mono flex items-center gap-1.5">
              <GraduationCap className="w-3 h-3 text-teal-600" /> Educación & Formación
            </h2>
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id || edu.institution} className="flex flex-wrap items-baseline justify-between text-xs">
                  <div className="font-bold text-slate-900">
                    {edu.degree} en {edu.fieldOfStudy} — <span className="text-slate-600 font-medium">{edu.institution}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {edu.startDate} - {edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-600 pb-1 mb-2.5 font-mono">
              Habilidades & Competencias
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
              <div>
                <strong className="text-slate-900">Habilidades Técnicas:</strong>{' '}
                {skills.technical.join(', ')}
              </div>
              <div>
                <strong className="text-slate-900">Herramientas & Stack:</strong>{' '}
                {skills.tools.join(', ')}
              </div>
              <div>
                <strong className="text-slate-900">Liderazgo & Soft Skills:</strong>{' '}
                {skills.soft.join(', ')}
              </div>
              <div>
                <strong className="text-slate-900">Idiomas:</strong>{' '}
                {skills.languages.join(', ')}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
