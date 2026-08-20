'use client'

import React from 'react'
import Image from 'next/image'
import { AGENTS } from '@/lib/agents/config'
import { AgentFinding, AgentId } from '@/types'
import { CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react'

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
              className={`rounded-2xl border transition-all duration-300 overflow-hidden flex items-center gap-3 p-2.5 ${
                isActive
                  ? 'bg-slate-900/95 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                  : isCompleted
                  ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-80'
              }`}
            >
              {/* Agent Image thumbnail */}
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 shrink-0 border border-slate-700/60 shadow-md">
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  fill
                  className="object-cover object-top"
                />
              </div>

              {/* Agent Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[9px] font-mono tracking-wider uppercase text-emerald-400 font-bold truncate">
                    {agent.id.replace('_', ' ')}
                  </span>
                  {isActive && isRunningPipeline ? (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-semibold border border-emerald-500/40 animate-pulse">
                      <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      Analizando
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
                ? 'bg-slate-900/90 border-emerald-500/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                : isCompleted
                ? 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600'
                : 'bg-slate-950/50 border-slate-800/60 opacity-80'
            }`}
          >
            {/* Header image banner */}
            <div className="relative h-16 w-full bg-slate-950 overflow-hidden group shrink-0">
              <Image
                src={agent.avatar}
                alt={agent.name}
                fill
                className={`object-cover object-top transition-transform duration-500 ${
                  isActive ? 'scale-105 brightness-110' : 'brightness-90'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-1 right-1">
                {isActive && isRunningPipeline ? (
                  <span className="flex items-center gap-0.5 px-1 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[8px] font-semibold border border-emerald-500/40 animate-pulse backdrop-blur-md">
                    <Loader2 className="w-2 h-2 animate-spin" />
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
