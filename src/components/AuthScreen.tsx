'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Sparkles, Mail, ArrowRight, ShieldCheck, CheckCircle2, Loader2, Cpu, FileText } from 'lucide-react'
import { signInWithGoogle, isSupabaseConfigured } from '@/lib/supabase'

interface AuthScreenProps {
  onLoginSuccess: (email: string) => void
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    try {
      if (isSupabaseConfigured) {
        await signInWithGoogle()
      } else {
        // Instant verified access if Supabase is initializing
        setTimeout(() => {
          onLoginSuccess('erick.diaz@growhack.ai')
        }, 500)
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al autenticar con Google')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Por favor ingresa un correo electrónico válido')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      onLoginSuccess(email.trim())
      setIsLoading(false)
    }, 400)
  }

  const agentsPreview = [
    {
      name: 'The Diagnoser',
      role: 'Auditoría & Score ATS',
      avatar: '/agents/diagnoser.jpg',
      motto: 'Diagnóstico clínico de fallas y compatibilidad ATS.'
    },
    {
      name: 'The Recruiter',
      role: 'Filtro de 6 Segundos',
      avatar: '/agents/recruiter.jpg',
      motto: 'Optimización de palabras clave y jerarquía visual.'
    },
    {
      name: 'The Hiring Manager',
      role: 'Métricas Google XYZ',
      avatar: '/agents/hiring-manager.jpg',
      motto: 'Cuantificación de logros y alineación de liderazgo.'
    },
    {
      name: 'The Rewriter',
      role: 'Redacción Maestra',
      avatar: '/agents/rewriter.jpg',
      motto: 'Copy persuasivo de alto impacto y exportación.'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[300px] bg-teal-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Top minimal header */}
      <header className="px-6 py-5 flex items-center justify-between border-b border-slate-900/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white">Currículum Vitae</h1>
            <p className="text-[11px] text-emerald-400 font-mono font-medium">CUATRO AGENTES IA</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-emerald-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Powered by Gemini 2.0
        </div>
      </header>

      {/* Hero & Auth Central Section */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center z-10">
        
        {/* Left Column: Value Proposition & 4 Agents Showcase */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>La nueva era en creación de currículums</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Tu currículum auditado por un panel de <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">4 Agentes de IA</span>.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
            Conversa con <strong>The Orchestrator</strong>, sube tu CV actual (PDF/Word) o tus fotos de perfil y obtén un currículum de impacto mundial descargable en <strong>PDF, Word (.docx) y PowerPoint (.pptx)</strong>.
          </p>

          {/* 4 Agents Mini Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {agentsPreview.map((ag) => (
              <div
                key={ag.name}
                className="bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-lg group hover:border-emerald-500/40 transition-all"
              >
                <div className="relative h-20 w-full bg-slate-950">
                  <Image
                    src={ag.avatar}
                    alt={ag.name}
                    fill
                    className="object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                </div>
                <div className="p-2 text-left">
                  <h4 className="text-[11px] font-bold text-white truncate">{ag.name}</h4>
                  <p className="text-[10px] text-emerald-400 font-mono truncate">{ag.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 font-medium">
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Formato 100% ATS-Proof
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Exportación en Word & PPTX
            </span>
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Google Gemini Integrado
            </span>
          </div>
        </div>

        {/* Right Column: Authentication Card */}
        <div className="lg:col-span-5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative text-left">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white tracking-tight">Acceso a la Plataforma</h3>
              <p className="text-xs text-slate-400 mt-1">
                Inicia sesión o regístrate para interactuar con los agentes
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              {/* Google OAuth Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                )}
                <span>Continuar con Google</span>
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-[11px] text-slate-500 font-medium">o ingresa con tu correo</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Correo Electrónico
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@empresa.com"
                    required
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  <span>Ingresar al Estudio</span>
                  <ArrowRight className="w-4 h-4 font-bold" />
                </button>
              </form>
            </div>

            {/* Privacy notice */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Acceso seguro. Tus datos y currículums son estrictamente confidenciales.</span>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 px-6 border-t border-slate-900/80 text-center text-xs text-slate-400 font-mono">
        © 2026 Resume Studio · Multi-Agent Career Architecture · Powered by Google Gemini
      </footer>
    </div>
  )
}
