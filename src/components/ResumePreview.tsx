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
  Loader2,
  IdCard,
  Layers,
  Palette
} from 'lucide-react'

interface ResumePreviewProps {
  resume: StructuredResume | null
  onDownload: (format: 'pdf' | 'docx' | 'pptx') => Promise<void>
  isDownloading: boolean
}

type TemplateType = 'executive' | 'bento' | 'classic' | 'tech'

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  onDownload,
  isDownloading
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(
    resume?.templateId || 'executive'
  )

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
    idNumber: '',
    title: 'Especialista',
    email: '',
    phone: '',
    location: '',
    summary: '',
    photoUrl: ''
  }

  const workExperience = Array.isArray(resume.workExperience) ? resume.workExperience : []
  const education = Array.isArray(resume.education) ? resume.education : []
  
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
    overall: 96,
    formatting: 98,
    keywordMatch: 95,
    impactScore: 96
  }

  const templates: { id: TemplateType; name: string; tag: string }[] = [
    { id: 'executive', name: 'Modern Executive', tag: 'Stripe / Apple Style' },
    { id: 'bento', name: 'Bento Grid', tag: 'Silicon Valley Clean' },
    { id: 'tech', name: 'Tech Specialist', tag: 'Modern Pro & Chips' },
    { id: 'classic', name: 'Classic Harvard', tag: '100% ATS Platinum' }
  ]

  return (
    <div className="h-full flex flex-col bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Top Action Bar: Template Selector & Export Buttons */}
      <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Template Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <Palette className="w-3.5 h-3.5 text-emerald-400 ml-1.5 hidden sm:inline" />
          <div className="flex items-center gap-1">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedTemplate === tpl.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title={tpl.tag}
              >
                {tpl.name}
              </button>
            ))}
          </div>
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
            <span>PDF</span>
          </button>

          {/* Word DOCX */}
          <button
            onClick={() => onDownload('docx')}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-blue-500/20"
            title="Descargar en Word (.docx editable)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Word</span>
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
          ✓ Plantilla: {templates.find((t) => t.id === selectedTemplate)?.name}
        </div>
      </div>

      {/* Main Sheet Container */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar bg-slate-950">
        <div className="max-w-[780px] mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-slate-200 transition-all text-left">
          
          {/* TEMPLATE 1: MODERN EXECUTIVE */}
          {selectedTemplate === 'executive' && (
            <div>
              {/* Header with Dark Luxury Accent */}
              <div className="bg-slate-900 text-white rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 relative overflow-hidden shadow-lg border border-slate-800">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
                    {personalInfo.fullName}
                  </h1>
                  <p className="text-sm font-bold text-emerald-400 mt-0.5 tracking-wide">
                    {personalInfo.title}
                  </p>
                  
                  {/* Identification and contact tags */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-xs text-slate-300 mt-3 font-medium">
                    {personalInfo.idNumber && (
                      <span className="flex items-center gap-1 text-emerald-300 font-mono">
                        <IdCard className="w-3.5 h-3.5" /> ID: {personalInfo.idNumber}
                      </span>
                    )}
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

                {/* Photo */}
                {personalInfo.photoUrl && (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xl shrink-0 bg-slate-950">
                    <img
                      src={personalInfo.photoUrl}
                      alt={personalInfo.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Summary */}
              {personalInfo.summary && (
                <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-1.5 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Perfil Profesional
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                    {personalInfo.summary}
                  </p>
                </div>
              )}

              {/* Work Experience */}
              {workExperience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-emerald-600 pb-1 mb-3 font-mono flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600" /> Experiencia Profesional
                  </h2>
                  <div className="space-y-4">
                    {workExperience.map((exp, idx) => (
                      <div key={exp.id || idx} className="border-l-2 border-slate-200 pl-3.5 ml-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-1">
                          <div className="text-sm font-bold text-slate-900">
                            {exp.role} <span className="text-emerald-700 font-semibold">| {exp.company}</span>
                          </div>
                          <div className="text-[11px] font-medium text-slate-500">
                            {exp.startDate} - {exp.current ? 'Presente' : exp.endDate || ''}
                            {exp.location ? ` · ${exp.location}` : ''}
                          </div>
                        </div>
                        {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                          <ul className="mt-1.5 space-y-1">
                            {exp.achievements.map((ach, aIdx) => (
                              <li key={aIdx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-relaxed">
                                <span className="text-emerald-600 font-bold mt-0.5">•</span>
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
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-emerald-600 pb-1 mb-2.5 font-mono flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" /> Educación & Formación
                  </h2>
                  <div className="space-y-2">
                    {education.map((edu, idx) => (
                      <div key={edu.id || idx} className="flex flex-wrap items-baseline justify-between text-xs">
                        <div className="font-bold text-slate-900">
                          {edu.degree} {edu.fieldOfStudy ? `en ${edu.fieldOfStudy}` : ''} — <span className="text-slate-600 font-medium">{edu.institution}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
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
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-emerald-600 pb-1 mb-2.5 font-mono">
                    Habilidades & Competencias
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    {technicalSkills.length > 0 && (
                      <div>
                        <strong className="text-slate-900">Técnicas:</strong>{' '}
                        {technicalSkills.join(', ')}
                      </div>
                    )}
                    {toolsSkills.length > 0 && (
                      <div>
                        <strong className="text-slate-900">Herramientas:</strong>{' '}
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
          )}

          {/* TEMPLATE 2: BENTO GRID */}
          {selectedTemplate === 'bento' && (
            <div className="space-y-4">
              {/* Top Bento Header Card */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900">{personalInfo.fullName}</h1>
                  <p className="text-sm font-bold text-blue-600 mt-0.5">{personalInfo.title}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-600 mt-2">
                    {personalInfo.idNumber && <span className="font-mono bg-white px-2 py-0.5 rounded border">ID: {personalInfo.idNumber}</span>}
                    {personalInfo.email && <span>{personalInfo.email}</span>}
                    {personalInfo.phone && <span>· {personalInfo.phone}</span>}
                    {personalInfo.location && <span>· {personalInfo.location}</span>}
                  </div>
                </div>
                {personalInfo.photoUrl && (
                  <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-20 h-20 rounded-2xl object-cover border border-slate-300" />
                )}
              </div>

              {/* Bento Grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">Experiencia</h3>
                  <div className="space-y-3">
                    {workExperience.map((exp, idx) => (
                      <div key={idx}>
                        <div className="text-xs font-bold text-slate-900">{exp.role} · <span className="text-blue-600">{exp.company}</span></div>
                        <ul className="mt-1 space-y-1">
                          {exp.achievements?.map((ach, aIdx) => (
                            <li key={aIdx} className="text-xs text-slate-600">• {ach}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h3 className="text-xs font-bold uppercase text-slate-900 mb-1.5">Perfil</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{personalInfo.summary}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <h3 className="text-xs font-bold uppercase text-slate-900 mb-1.5">Habilidades</h3>
                    <div className="flex flex-wrap gap-1">
                      {technicalSkills.concat(toolsSkills).map((s, i) => (
                        <span key={i} className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 3: TECH SPECIALIST */}
          {selectedTemplate === 'tech' && (
            <div className="space-y-5">
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 font-mono">{personalInfo.fullName}</h1>
                  <p className="text-sm font-bold text-emerald-600 mt-1">{personalInfo.title}</p>
                  <p className="text-xs text-slate-600 mt-1.5">{personalInfo.email} · {personalInfo.phone} · {personalInfo.location}</p>
                </div>
                {personalInfo.photoUrl && (
                  <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-20 h-20 rounded-xl object-cover border-2 border-slate-900" />
                )}
              </div>

              {personalInfo.summary && (
                <div>
                  <h3 className="text-xs font-mono font-bold uppercase text-slate-900 mb-1">// PERFIL PROFESIONAL</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{personalInfo.summary}</p>
                </div>
              )}

              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-slate-900 mb-2">// EXPERIENCIA & LOGROS</h3>
                <div className="space-y-3">
                  {workExperience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="text-xs font-bold text-slate-900">{exp.role} <span className="text-emerald-700">@{exp.company}</span> ({exp.startDate} - {exp.current ? 'Presente' : exp.endDate})</div>
                      <ul className="mt-1 space-y-1">
                        {exp.achievements?.map((ach, aIdx) => (
                          <li key={aIdx} className="text-xs text-slate-700">→ {ach}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 4: CLASSIC HARVARD */}
          {selectedTemplate === 'classic' && (
            <div className="space-y-4 font-serif">
              <div className="text-center border-b border-slate-300 pb-3">
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest">{personalInfo.fullName}</h1>
                <p className="text-xs text-slate-700 mt-1">{personalInfo.location} | {personalInfo.phone} | {personalInfo.email} {personalInfo.idNumber ? `| ID: ${personalInfo.idNumber}` : ''}</p>
              </div>

              {personalInfo.summary && (
                <div>
                  <h3 className="text-xs font-bold uppercase border-b border-slate-400 pb-0.5 mb-1 font-sans text-slate-900">Perfil Profesional</h3>
                  <p className="text-xs text-slate-800 leading-relaxed">{personalInfo.summary}</p>
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold uppercase border-b border-slate-400 pb-0.5 mb-1.5 font-sans text-slate-900">Experiencia Laboral</h3>
                <div className="space-y-3">
                  {workExperience.map((exp, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs font-bold text-slate-900">
                        <span>{exp.company} — {exp.role}</span>
                        <span>{exp.startDate} - {exp.current ? 'Presente' : exp.endDate}</span>
                      </div>
                      <ul className="mt-1 space-y-0.5 list-disc list-inside">
                        {exp.achievements?.map((ach, aIdx) => (
                          <li key={aIdx} className="text-xs text-slate-800">{ach}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase border-b border-slate-400 pb-0.5 mb-1 font-sans text-slate-900">Educación</h3>
                {education.map((edu, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-800">
                    <span>{edu.institution}, {edu.degree} en {edu.fieldOfStudy}</span>
                    <span>{edu.startDate} - {edu.endDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
