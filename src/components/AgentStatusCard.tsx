'use client'

import React from 'react'
import Image from 'next/image'
import { AGENTS } from '@/lib/agents/config'
import { AgentFinding, AgentId } from '@/types'
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react'

interface AgentStatusCardProps {
  findings?: AgentFinding[]
  activeAgentId?: AgentId | null
  isRunningPipeline?: boolean
}

export const AgentStatusCard: React.FC<AgentStatusCardProps> = ({
  findings = [],
  activeAgentId,
  isRunningPipeline
}) => {
  const agentKeys: AgentId[] = ['diagnoser', 'recruiter', 'hiring_manager', 'rewriter']

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
      {agentKeys.map((id) => {
        const agent = AGENTS[id]
        const finding = findings.find((f) => f.agentId === id)
        const isActive = activeAgentId === id
        const isCompleted = Boolean(finding?.status === 'completed')

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
            <div className="relative h-16 sm:h-28 w-full bg-slate-950 overflow-hidden group shrink-0">
              <Image
                src={agent.avatar}
                alt={agent.name}
                fill
                className={`object-cover object-top transition-transform duration-500 group-hover:scale-105 ${
                  isActive ? 'scale-105 brightness-110' : 'brightness-90'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
                {isActive && isRunningPipeline ? (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] sm:text-[10px] font-semibold border border-emerald-500/40 animate-pulse backdrop-blur-md">
                    <Loader2 className="w-2.5 h-2.5 animate-spin" />
                    <span className="hidden sm:inline">Analizando</span>
                  </span>
                ) : isCompleted ? (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[9px] sm:text-[10px] font-semibold border border-teal-500/40 backdrop-blur-md">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{finding?.score ? `${finding.score}%` : 'OK'}</span>
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-full bg-slate-900/80 text-slate-400 text-[9px] sm:text-[10px] border border-slate-800 backdrop-blur-md">
                    En espera
                  </span>
                )}
              </div>

              {/* Agent Title overlay */}
              <div className="absolute bottom-1 left-2 right-1 sm:bottom-2 sm:left-2.5 sm:right-2">
                <span className="text-[8px] sm:text-[10px] font-mono tracking-wider uppercase text-emerald-400 font-semibold block leading-tight">
                  {agent.id.replace('_', ' ')}
                </span>
                <h4 className="text-[11px] sm:text-xs font-bold text-white truncate leading-tight">
                  {agent.name}
                </h4>
              </div>
            </div>

            {/* Description only on larger screens to keep mobile lean */}
            <div className="hidden sm:flex p-2 flex-1 flex-col justify-between text-left">
              <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {finding?.summary || agent.motto}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
