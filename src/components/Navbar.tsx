'use client'

import React from 'react'
import { Sparkles, LogOut, Cpu } from 'lucide-react'

interface NavbarProps {
  userEmail: string
  onSignOut: () => void
  splitView: boolean
  onToggleSplitView: () => void
  hasActiveResume: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  userEmail,
  onSignOut
}) => {
  return (
    <header className="h-14 sm:h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between z-30 sticky top-0 shrink-0">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-slate-950 shrink-0">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 font-bold" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm sm:text-base tracking-tight text-white">Currículum Vitae</span>
            <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-medium">
              AGENTE IA
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 hidden sm:block">Arquitectura Profesional de Carrera</p>
        </div>
      </div>

      {/* Right Controls: User Account with Sign Out */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>Gemini Activo</span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-slate-800">
          <div className="w-7 h-7 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-xs font-semibold text-emerald-300 shrink-0">
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-slate-300 hidden sm:inline max-w-[120px] truncate">
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
