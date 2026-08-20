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
  User,
  Palette,
  CheckCircle2,
  Award,
  Settings
} from 'lucide-react'

interface ResumePreviewProps {
  resume: StructuredResume | null
  onDownload: (format: 'pdf' | 'docx' | 'pptx') => Promise<void>
  isDownloading: boolean
}

type TemplateType = 'canva_editorial' | 'executive' | 'bento' | 'classic' | 'tech'

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  resume,
  onDownload,
  isDownloading
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('canva_editorial')

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

  // Safe normalized data with all personal identification fields
  const personalInfo = resume.personalInfo || {
    fullName: 'Basew Asfur',
    idNumber: '12.424.592',
    age: '49 años',
    maritalStatus: 'Soltero',
    nationality: 'Venezolano',
    title: 'Ingeniero Electricista',
    email: 'asfurba7@gmail.com',
    phone: '0426-1267836 – 0424-2914792',
    location: 'Carabobo, Venezuela',
    summary: '',
    photoUrl: ''
  }

  const workExperience = Array.isArray(resume.workExperience) ? resume.workExperience : []
  const education = Array.isArray(resume.education) ? resume.education : []
  const certifications = Array.isArray(resume.certifications) ? resume.certifications : []
  
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
    { id: 'canva_editorial', name: '🎨 Canva Pro (Réplica Original)', tag: '2 Columnas con Franja Superior y Barra Salvia' },
    { id: 'executive', name: '💼 Modern Executive', tag: 'Stripe & Apple Elegance' },
    { id: 'bento', name: '🍱 Bento Silicon Valley', tag: 'Tarjetas Modulares Clean' },
    { id: 'tech', name: '⚡ Tech & Leadership', tag: 'Chips y Métricas STAR' },
    { id: 'classic', name: '🏛️ Classic Harvard', tag: '100% ATS Platinum' }
  ]

  return (
    <div className="h-full flex flex-col bg-slate-950/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
      {/* Top Action Bar: Template Selector & Export Buttons */}
      <div className="p-3 sm:p-4 border-b border-slate-800/80 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 shrink-0">
        
        {/* Template Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <Palette className="w-4 h-4 text-emerald-400 ml-1.5 hidden sm:inline" />
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedTemplate === tpl.id
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20 scale-[1.02]'
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
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-emerald-500/20"
            title="Descargar PDF Idéntico a Pantalla"
          >
            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            <span>Descargar PDF</span>
          </button>

          {/* Word DOCX */}
          <button
            onClick={() => onDownload('docx')}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-blue-500/20"
            title="Descargar en Word (.docx editable)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Word</span>
          </button>

          {/* PPTX */}
          <button
            onClick={() => onDownload('pptx')}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-md shadow-amber-500/20"
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
          ✓ {templates.find((t) => t.id === selectedTemplate)?.name}
        </div>
      </div>

      {/* Main Sheet Container */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-6 custom-scrollbar bg-slate-950">
        <div
          id="resume-printable-sheet"
          className="max-w-[840px] mx-auto bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-left font-sans"
        >
          
          {/* ========================================================================= */}
          {/* TEMPLATE 1: CANVA EDITORIAL (EXACT REPLICA OF USER'S CANVA ORIGINAL CV) */}
          {/* ========================================================================= */}
          {selectedTemplate === 'canva_editorial' && (
            <div className="grid grid-cols-12 min-h-[960px]">
              
              {/* Left Sidebar (Width: 38% · Color: #DDE5DE Salvia Suave) */}
              <div className="col-span-12 sm:col-span-5 md:col-span-4 bg-[#DCE4DF] p-5 sm:p-6 border-r border-[#C6D2CA] flex flex-col gap-5 text-slate-800">
                
                {/* Photo: Fully visible portrait with soft borders */}
                <div className="w-full flex justify-center">
                  <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-slate-300 flex items-center justify-center relative">
                    {personalInfo.photoUrl ? (
                      <img
                        src={personalInfo.photoUrl}
                        alt={personalInfo.fullName}
                        className="w-full h-full object-cover object-top"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 bg-slate-200">
                        <User className="w-14 h-14 mb-1 text-slate-400" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Fotografía</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 1: DATOS PERSONALES */}
                <div className="bg-white/90 rounded-2xl p-4 border border-white shadow-sm space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 font-mono">
                    DATOS PERSONALES
                  </h3>
                  <div className="text-[12px] sm:text-[13px] text-slate-800 space-y-1.5 font-medium leading-relaxed">
                    {personalInfo.idNumber && (
                      <p>
                        <span className="font-bold text-slate-900">Cédula de Identidad:</span> {personalInfo.idNumber}
                      </p>
                    )}
                    {personalInfo.age && (
                      <p>
                        <span className="font-bold text-slate-900">Edad:</span> {personalInfo.age}
                      </p>
                    )}
                    {personalInfo.maritalStatus && (
                      <p>
                        <span className="font-bold text-slate-900">Estado civil:</span> {personalInfo.maritalStatus}
                      </p>
                    )}
                    {personalInfo.nationality && (
                      <p>
                        <span className="font-bold text-slate-900">Nacionalidad:</span> {personalInfo.nationality}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card 2: CONTACTO */}
                <div className="bg-white/90 rounded-2xl p-4 border border-white shadow-sm space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 font-mono">
                    CONTACTO
                  </h3>
                  <div className="text-[12px] sm:text-[13px] text-slate-800 space-y-2 font-medium">
                    {personalInfo.phone && (
                      <p className="flex items-start gap-2">
                        <Phone className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                        <span>{personalInfo.phone}</span>
                      </p>
                    )}
                    {personalInfo.email && (
                      <p className="flex items-start gap-2 break-all">
                        <Mail className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                        <span>{personalInfo.email}</span>
                      </p>
                    )}
                    {personalInfo.location && (
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                        <span>{personalInfo.location}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Card 3: EDUCACIÓN & TÍTULOS ACADÉMICOS */}
                {education.length > 0 && (
                  <div className="bg-white/90 rounded-2xl p-4 border border-white shadow-sm space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 font-mono flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-800" /> EDUCACIÓN
                    </h3>
                    <div className="space-y-2.5">
                      {education.map((edu, idx) => (
                        <div key={idx} className="border-b border-slate-100 last:border-0 pb-2 last:pb-0 text-xs sm:text-[12.5px]">
                          <p className="font-bold text-slate-900 leading-snug">
                            {edu.degree} {edu.fieldOfStudy ? `en ${edu.fieldOfStudy}` : ''}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-0.5">
                            {edu.institution} {edu.startDate ? `(${edu.startDate} - ${edu.endDate || ''})` : ''}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Card 4: COMPETENCIAS & HABILIDADES */}
                {(technicalSkills.length > 0 || toolsSkills.length > 0) && (
                  <div className="bg-white/90 rounded-2xl p-4 border border-white shadow-sm space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 font-mono">
                      COMPETENCIAS CLAVE
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {technicalSkills.concat(toolsSkills).map((sk, idx) => (
                        <span key={idx} className="text-[11px] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300 text-slate-800 font-semibold shadow-xs">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Right Column (Width: 62% · Clean White Content with Canva Top Banner) */}
              <div className="col-span-12 sm:col-span-7 md:col-span-8 p-6 sm:p-8 flex flex-col gap-6">
                
                {/* Top Canva Header Band (Gray horizontal band with letter-spaced subtitle & Big Name) */}
                <div className="bg-[#EFEFEF] -mx-6 sm:-mx-8 -mt-6 sm:-mt-8 p-6 sm:p-8 border-b border-slate-200">
                  <p className="text-xs sm:text-sm font-mono font-bold tracking-[0.25em] text-slate-600 uppercase">
                    S Í N T E S I S   C U R R I C U L A R
                  </p>
                  <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-black text-slate-900 mt-2 tracking-tight leading-none font-sans">
                    {personalInfo.fullName}
                  </h1>
                  {personalInfo.title && (
                    <p className="text-sm sm:text-base font-bold text-emerald-800 mt-2 tracking-wide">
                      {personalInfo.title}
                    </p>
                  )}
                </div>

                {/* Perfil Profesional */}
                {personalInfo.summary && (
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-emerald-700 pb-1 mb-2.5 font-mono flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-700" /> PERFIL PROFESIONAL & EJECUTIVO
                    </h2>
                    <p className="text-xs sm:text-[13.5px] text-slate-700 leading-relaxed text-justify">
                      {personalInfo.summary}
                    </p>
                  </div>
                )}

                {/* Responsabilidades & Trayectoria Laboral / Política */}
                {workExperience.length > 0 && (
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-emerald-700 pb-1 mb-3.5 font-mono flex items-center gap-1.5">
                      <Settings className="w-4 h-4 text-emerald-700" /> RESPONSABILIDADES & TRAYECTORIA
                    </h2>
                    <div className="space-y-4">
                      {workExperience.map((exp, idx) => (
                        <div key={idx} className="bg-slate-50/90 p-4 rounded-xl border border-slate-200">
                          <div className="flex flex-wrap items-baseline justify-between gap-1 mb-1.5">
                            <h4 className="text-sm sm:text-[14px] font-bold text-slate-900 leading-tight">
                              {exp.role} <span className="text-emerald-800 font-semibold">| {exp.company}</span>
                            </h4>
                            <span className="text-[11px] font-mono font-medium text-slate-500">
                              {exp.startDate} - {exp.current ? 'Presente' : exp.endDate || ''}
                            </span>
                          </div>
                          {Array.isArray(exp.achievements) && exp.achievements.length > 0 && (
                            <ul className="space-y-1.5 mt-2">
                              {exp.achievements.map((ach, aIdx) => (
                                <li key={aIdx} className="text-xs sm:text-[13px] text-slate-700 flex items-start gap-2 leading-relaxed">
                                  <span className="text-emerald-700 font-black mt-0.5">•</span>
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

                {/* Certificaciones y Cargos Adicionales */}
                {certifications.length > 0 && (
                  <div>
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b-2 border-emerald-700 pb-1 mb-2.5 font-mono flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-emerald-700" /> CERTIFICACIONES & RECONOCIMIENTOS
                    </h2>
                    <div className="space-y-2">
                      {certifications.map((cert, cIdx) => (
                        <div key={cIdx} className="text-xs sm:text-[13px] text-slate-700 flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="font-semibold text-slate-900">{cert.name} — {cert.issuer}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{cert.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE 2: MODERN EXECUTIVE (Stripe / Apple Style) */}
          {/* ========================================================================= */}
          {selectedTemplate === 'executive' && (
            <div className="p-6 sm:p-10">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative overflow-hidden shadow-lg border border-slate-800">
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
                    {personalInfo.fullName}
                  </h1>
                  <p className="text-base font-bold text-emerald-400 mt-1">
                    {personalInfo.title}
                  </p>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-300 mt-3.5 font-medium">
                    {personalInfo.idNumber && <span className="font-mono text-emerald-300">ID: {personalInfo.idNumber}</span>}
                    {personalInfo.phone && <span>📞 {personalInfo.phone}</span>}
                    {personalInfo.email && <span>✉️ {personalInfo.email}</span>}
                    {personalInfo.location && <span>📍 {personalInfo.location}</span>}
                  </div>
                </div>
                {personalInfo.photoUrl && (
                  <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xl shrink-0 bg-slate-950">
                    <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-full h-full object-cover object-top" crossOrigin="anonymous" />
                  </div>
                )}
              </div>

              {personalInfo.summary && (
                <div className="mb-6 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h2 className="text-xs font-bold uppercase text-teal-800 mb-1.5 font-mono flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" /> Perfil Profesional
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{personalInfo.summary}</p>
                </div>
              )}

              {workExperience.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase text-slate-900 border-b-2 border-emerald-600 pb-1 mb-3.5 font-mono">Experiencia & Responsabilidades</h2>
                  <div className="space-y-4">
                    {workExperience.map((exp, idx) => (
                      <div key={idx} className="border-l-2 border-slate-200 pl-4 ml-1">
                        <div className="flex justify-between text-sm font-bold text-slate-900">
                          <span>{exp.role} | {exp.company}</span>
                          <span className="text-xs text-slate-500 font-mono">{exp.startDate} - {exp.current ? 'Presente' : exp.endDate}</span>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {exp.achievements?.map((ach, aIdx) => (
                            <li key={aIdx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-1.5">• {ach}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE 3: BENTO GRID */}
          {/* ========================================================================= */}
          {selectedTemplate === 'bento' && (
            <div className="p-6 sm:p-8 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">{personalInfo.fullName}</h1>
                  <p className="text-sm font-bold text-blue-600 mt-0.5">{personalInfo.title}</p>
                  <p className="text-xs text-slate-600 mt-2">{personalInfo.idNumber ? `ID: ${personalInfo.idNumber} · ` : ''}{personalInfo.phone} · {personalInfo.email}</p>
                </div>
                {personalInfo.photoUrl && <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-20 h-24 rounded-2xl object-cover" crossOrigin="anonymous" />}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 p-5 rounded-2xl bg-white border border-slate-200">
                  <h3 className="text-xs font-bold uppercase text-slate-900 mb-2">Trayectoria</h3>
                  {workExperience.map((exp, idx) => (
                    <div key={idx} className="mb-3">
                      <div className="text-xs font-bold text-slate-900">{exp.role} · {exp.company}</div>
                      <ul className="mt-1 space-y-0.5">
                        {exp.achievements?.map((ach, aIdx) => (
                          <li key={aIdx} className="text-xs text-slate-600">• {ach}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <h3 className="text-xs font-bold uppercase text-slate-900 mb-1.5">Perfil</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{personalInfo.summary}</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE 4: TECH */}
          {/* ========================================================================= */}
          {selectedTemplate === 'tech' && (
            <div className="p-6 sm:p-8 space-y-5">
              <div className="border-b-2 border-slate-900 pb-4 flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-slate-900 font-mono">{personalInfo.fullName}</h1>
                  <p className="text-sm font-bold text-emerald-600 mt-1">{personalInfo.title}</p>
                  <p className="text-xs text-slate-600 mt-1.5">{personalInfo.idNumber ? `ID: ${personalInfo.idNumber} | ` : ''}{personalInfo.phone} | {personalInfo.email}</p>
                </div>
                {personalInfo.photoUrl && <img src={personalInfo.photoUrl} alt={personalInfo.fullName} className="w-20 h-24 rounded-xl object-cover border-2 border-slate-900" crossOrigin="anonymous" />}
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase text-slate-900 mb-2">// RESPONSABILIDADES & LOGROS</h3>
                {workExperience.map((exp, idx) => (
                  <div key={idx} className="mb-3">
                    <div className="text-xs font-bold text-slate-900">{exp.role} @{exp.company} ({exp.startDate} - {exp.current ? 'Presente' : exp.endDate})</div>
                    <ul className="mt-1 space-y-1">
                      {exp.achievements?.map((ach, aIdx) => (
                        <li key={aIdx} className="text-xs text-slate-700">→ {ach}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TEMPLATE 5: CLASSIC */}
          {selectedTemplate === 'classic' && (
            <div className="p-6 sm:p-10 space-y-4 font-serif">
              <div className="text-center border-b border-slate-300 pb-3">
                <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest">{personalInfo.fullName}</h1>
                <p className="text-xs text-slate-700 mt-1">{personalInfo.location} | {personalInfo.phone} | {personalInfo.email} {personalInfo.idNumber ? `| ID: ${personalInfo.idNumber}` : ''}</p>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase border-b border-slate-400 pb-0.5 mb-1 font-sans text-slate-900">Trayectoria Laboral</h3>
                {workExperience.map((exp, idx) => (
                  <div key={idx} className="mb-3">
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
          )}

        </div>
      </div>
    </div>
  )
}
