'use client'

import React from 'react'
import { Sparkles, Layout, LogOut, Cpu, ShieldCheck } from 'lucide-react'

interface NavbarProps {
  userEmail: string
  onSignOut: () => void
  splitView: boolean
  onToggleSplitView: () => void
  hasActiveResume: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  userEmail,
  onSignOut,
  splitView,
  onToggleSplitView,
  hasActiveResume
}) => {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950">
          <Sparkles className="w-5 h-5 font-bold" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-white">Currículum Vitae</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">
              CUATRO AGENTES IA
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">Arquitectura Profesional de Carrera</p>
        </div>
      </div>

      {/* Center Controls: View Switcher */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSplitView}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            splitView
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
          title="Alternar vista dividida de CV"
        >
          <Layout className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{splitView ? 'Vista Dividida (Activa)' : 'Ver Vista Dividida'}</span>
        </button>

        {hasActiveResume && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-950/50 border border-teal-500/30 text-[11px] text-teal-300">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            CV Generado
          </div>
        )}
      </div>

      {/* Right Controls: AI Engine status & User Account */}
      <div className="flex items-center gap-3">
        {/* Gemini Active Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Gemini Pro Active</span>
        </div>

        {/* User Account with Sign Out */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-xs font-semibold text-emerald-300">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-slate-300 hidden md:inline max-w-[140px] truncate">
            {userEmail}
          </span>
          <button
            onClick={onSignOut}
            className="flex items-center gap-1 p-1.5 px-2 rounded-lg bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}
