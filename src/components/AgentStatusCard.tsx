'use client'

import React from 'react'
import Image from 'next/image'
import { AGENTS } from '@/lib/agents/config'
import { AgentFinding, AgentId } from '@/types'
import { CheckCircle2, Loader2, Sparkles, Activity } from 'lucide-react'

interface AgentStatusCardProps {
  findings?: AgentFinding[]
  activeAgentId?: AgentId | null
  isRunningPipeline?: boolean
  isVerticalSidebar?: boolean
}

export const AgentStatusCard: React.FC<AgentStatusCardProps> = ({
  findings = [],
  activeAgentId,
  isRunningPipeline,
  isVerticalSidebar = false
}) => {
  const agentKeys: AgentId[] = ['diagnoser', 'recruiter', 'hiring_manager', 'rewriter']

  return (
    <div className={isVerticalSidebar ? 'flex flex-col gap-2.5 h-full' : 'grid grid-cols-2 sm:grid-cols-4 gap-2'}>
      {agentKeys.map((id) => {
        const agent = AGENTS[id]
        const finding = findings.find((f) => f.agentId === id)
        const isActive = activeAgentId === id
        const isCompleted = Boolean(finding?.status === 'completed')

        if (isVerticalSidebar) {
          return (
            <div
              key={id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden flex items-center gap-3 p-3 ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-emerald-400 shadow-xl shadow-emerald-500/25 ring-2 ring-emerald-400 scale-[1.02]'
                  : isCompleted
                  ? 'bg-slate-900/80 border-teal-500/40 hover:border-teal-500/60'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70'
              }`}
            >
              {/* Agent Image thumbnail */}
              <div className={`relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border transition-all ${
                isActive ? 'border-emerald-400 shadow-lg shadow-emerald-500/40 scale-105' : 'border-slate-700/60'
              }`}>
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  fill
                  className={`object-cover object-top transition-all ${
                    isActive ? 'brightness-110 saturate-125' : 'brightness-90'
                  }`}
                />
              </div>

              {/* Agent Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className={`text-[9px] font-mono tracking-wider uppercase font-bold truncate ${
                    isActive ? 'text-emerald-300' : 'text-emerald-400'
                  }`}>
                    {agent.id.replace('_', ' ')}
                  </span>
                  {isActive ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black uppercase tracking-wider animate-bounce shadow-md shadow-emerald-500/40">
                      <Activity className="w-2.5 h-2.5 animate-spin" />
                      Activo
                    </span>
                  ) : isCompleted ? (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[9px] font-semibold border border-teal-500/40">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {finding?.score ? `${finding.score}%` : 'Listo'}
                    </span>
                  ) : (
                    <span className="text-[9px] text-slate-500 font-mono">En espera</span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white truncate leading-tight">
                  {agent.name}
                </h4>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {finding?.summary || agent.motto}
                </p>
              </div>
            </div>
          )
        }

        // Horizontal Grid (Mobile top banner)
        return (
          <div
            key={id}
            className={`relative rounded-xl border transition-all duration-300 overflow-hidden flex flex-col ${
              isActive
                ? 'bg-slate-900 border-emerald-400 shadow-xl shadow-emerald-500/30 ring-2 ring-emerald-400 scale-[1.02]'
                : isCompleted
                ? 'bg-slate-900/80 border-slate-700/80'
                : 'bg-slate-950/60 border-slate-800/60 opacity-70'
            }`}
          >
            {/* Header image banner */}
            <div className="relative h-16 w-full bg-slate-950 overflow-hidden group shrink-0">
              <Image
                src={agent.avatar}
                alt={agent.name}
                fill
                className={`object-cover object-top transition-transform duration-500 ${
                  isActive ? 'scale-105 brightness-110 saturate-125' : 'brightness-90'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-1 right-1">
                {isActive ? (
                  <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[8px] font-black uppercase shadow-md animate-pulse">
                    Activo
                  </span>
                ) : isCompleted ? (
                  <span className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[8px] font-semibold border border-teal-500/40 backdrop-blur-md">
                    <CheckCircle2 className="w-2 h-2" />
                    <span>{finding?.score ? `${finding.score}%` : 'OK'}</span>
                  </span>
                ) : (
                  <span className="px-1 py-0.5 rounded-full bg-slate-900/80 text-slate-400 text-[8px] border border-slate-800 backdrop-blur-md">
                    Espera
                  </span>
                )}
              </div>

              {/* Agent Title overlay */}
              <div className="absolute bottom-1 left-1.5 right-1">
                <span className="text-[7px] font-mono tracking-wider uppercase text-emerald-400 font-semibold block leading-tight">
                  {agent.id.replace('_', ' ')}
                </span>
                <h4 className="text-[10px] font-bold text-white truncate leading-tight">
                  {agent.name}
                </h4>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
