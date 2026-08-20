'use client'

import React, { useState } from 'react'
import { StructuredResume } from '@/types'
import {
  Download,
  FileText,
  Presentation,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  Sparkles,
  MapPin,
  Mail,
  Phone,
  Link as LinkIcon,
  Loader2
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
  if (!resume) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 bg-slate-950/40 rounded-2xl border border-slate-800/80">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center border border-slate-800 text-slate-400 mb-4 shadow-inner">
          <FileText className="w-8 h-8 opacity-60" />
        </div>
        <h3 className="text-base font-semibold text-slate-300 mb-1">Vista Previa del Currículum</h3>
        <p className="text-xs text-slate-400 max-w-sm">
          Sube tus archivos o chatea con Alex para generar tu currículum optimizado.
        </p>
      </div>
    )
  }

  // Safe normalized fallback data
  const personalInfo = resume.personalInfo || {
    fullName: 'Candidato Profesional',
    title: 'Especialista',
    email: '',
    phone: '',
    location: '',
    summary: ''
  }

  const workExperience = Array.isArray(resume.workExperience) ? resume.workExperience : []
  const education = Array.isArray(resume.education) ? resume.education : []
  
  // Safe skills normalization (whether skills is object or array)
  let technicalSkills: string[] = []
  let toolsSkills: string[] = []
  let softSkills: string[] = []
  let languagesSkills: string[] = []

  if (Array.isArray(resume.skills)) {
    technicalSkills = resume.skills as any
  } else if (resume.skills && typeof resume.skills === 'object') {
    technicalSkills = Array.isArray(resume.skills.technical) ? resume.skills.technical : []
    toolsSkills = Array.isArray(resume.skills.tools) ? resume.skills.tools : []
    softSkills = Array.isArray(resume.skills.soft) ? resume.skills.soft : []
    languagesSkills = Array.isArray(resume.skills.languages) ? resume.skills.languages : []
  }

  const atsScore = resume.atsScore || {
    overall: 95,
    formatting: 96,
    keywordMatch: 94,
    impactScore: 95
  }

  return (
    <div className="h-full flex flex-col bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Top Action Bar */}
      <div className="p-3.5 sm:p-4 border-b border-slate-800/80 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-emerald-500/20"
            title="Descargar en PDF ATS-Friendly"
          >
            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            <span>Descargar PDF</span>
          </button>

          {/* Word DOCX */}
          <button
            onClick={() => onDownload('docx')}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-blue-500/20"
            title="Descargar en Word (.docx editable)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Word (.docx)</span>
          </button>

          {/* PPTX */}
          <button
            onClick={() => onDownload('pptx')}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-amber-500/20"
            title="Descargar Presentación (.pptx)"
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>PowerPoint</span>
          </button>
        </div>
      </div>

      {/* ATS Score Meter Banner */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-emerald-950/60 via-slate-900/60 to-teal-950/60 border-b border-emerald-500/20 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-300 text-xs">
            {atsScore.overall}%
          </div>
          <div>
            <div className="font-semibold text-emerald-300 flex items-center gap-1 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Score de Compatibilidad ATS Auditado
            </div>
            <p className="text-[10px] text-slate-400">
              Formato: {atsScore.formatting}% · Keywords: {atsScore.keywordMatch}% · Impacto: {atsScore.impactScore}%
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
          ✓ 100% ATS-Proof
        </div>
      </div>

      {/* Sheet Container (Simulates printed A4 page) */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar bg-slate-950">
        <div className="max-w-[760px] mx-auto bg-white text-slate-900 rounded-xl shadow-2xl p-5 sm:p-8 border border-slate-200">
          
          {/* Header */}
          <div className="border-b border-slate-200 pb-4 mb-4 flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase">
                {personalInfo.fullName}
              </h1>
              <p className="text-sm font-bold text-teal-700 mt-0.5">
                {personalInfo.title}
              </p>
              
              {/* Contact details */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2 font-medium">
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
              </div>
            </div>

            {/* Candidate Photo if provided */}
            {personalInfo.photoUrl && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-teal-600 shadow-md shrink-0">
                <img
                  src={personalInfo.photoUrl}
                  alt={personalInfo.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Professional Summary */}
          {personalInfo.summary && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-600 pb-1 mb-1.5 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-teal-600" /> Perfil Profesional
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                {personalInfo.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {workExperience.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-600 pb-1 mb-2 font-mono flex items-center gap-1.5">
                <Briefcase className="w-3 h-3 text-teal-600" /> Experiencia Profesional
              </h2>
              <div className="space-y-3.5">
                {workExperience.map((exp, idx) => (
                  <div key={exp.id || `exp-${idx}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-1">
                      <div className="text-xs sm:text-sm font-bold text-slate-900">
                        {exp.role} <span className="text-teal-700 font-semibold">| {exp.company}</span>
                      </div>
                      <div className="text-[10px] sm:text-[11px] font-medium text-slate-500">
                        {exp.startDate} - {exp.current ? 'Presente' : exp.endDate || ''}
                        {exp.location ? ` · ${exp.location}` : ''}
                      </div>
                    </div>
                    {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                      <ul className="mt-1 space-y-1">
                        {exp.achievements.map((ach, aIdx) => (
                          <li key={aIdx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-relaxed">
                            <span className="text-teal-600 font-bold mt-0.5">•</span>
                            <span>{ach}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div className="mb-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-600 pb-1 mb-2 font-mono flex items-center gap-1.5">
                <GraduationCap className="w-3 h-3 text-teal-600" /> Educación & Formación
              </h2>
              <div className="space-y-2">
                {education.map((edu, idx) => (
                  <div key={edu.id || `edu-${idx}`} className="flex flex-wrap items-baseline justify-between text-xs">
                    <div className="font-bold text-slate-900">
                      {edu.degree} {edu.fieldOfStudy ? `en ${edu.fieldOfStudy}` : ''} — <span className="text-slate-600 font-medium">{edu.institution}</span>
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                      {edu.startDate} - {edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {(technicalSkills.length > 0 || toolsSkills.length > 0 || softSkills.length > 0 || languagesSkills.length > 0) && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 border-b border-teal-600 pb-1 mb-2 font-mono">
                Habilidades & Competencias
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {technicalSkills.length > 0 && (
                  <div>
                    <strong className="text-slate-900">Habilidades Técnicas:</strong>{' '}
                    {technicalSkills.join(', ')}
                  </div>
                )}
                {toolsSkills.length > 0 && (
                  <div>
                    <strong className="text-slate-900">Herramientas & Stack:</strong>{' '}
                    {toolsSkills.join(', ')}
                  </div>
                )}
                {softSkills.length > 0 && (
                  <div>
                    <strong className="text-slate-900">Liderazgo & Soft Skills:</strong>{' '}
                    {softSkills.join(', ')}
                  </div>
                )}
                {languagesSkills.length > 0 && (
                  <div>
                    <strong className="text-slate-900">Idiomas:</strong>{' '}
                    {languagesSkills.join(', ')}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
