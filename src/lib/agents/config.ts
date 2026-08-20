import { AgentInfo } from '@/types'

export const AGENTS: Record<string, AgentInfo> = {
  orchestrator: {
    id: 'orchestrator',
    name: 'Alex',
    title: 'Asesor Principal & Agente IA',
    motto: 'Tu copiloto de IA para diseñar tu mejor currículum profesional',
    roleDescription: 'Interactúa contigo en el chat, coordina el panel de los 4 agentes y te entrega tus documentos listos para descargar.',
    avatar: '/agents/orchestrator.jpg',
    color: 'emerald',
    accentColor: '#10b981'
  },
  diagnoser: {
    id: 'diagnoser',
    name: 'The Diagnoser',
    title: 'Clinical Resume Auditor',
    motto: 'Understand beyond the surface · Analyze, Diagnose, Solve',
    roleDescription: 'Audita a fondo el currículum, detecta errores críticos, lagunas temporales y calcula la compatibilidad ATS.',
    avatar: '/agents/diagnoser.jpg',
    color: 'orange',
    accentColor: '#f97316'
  },
  recruiter: {
    id: 'recruiter',
    name: 'The Recruiter',
    title: 'Talent Acquisition Specialist',
    motto: 'Find the right people. Build what matters · Find, Attract, Engage, Hire',
    roleDescription: 'Aplica el test de los 6 segundos, optimiza la densidad de palabras clave e impulsa el atractivo para el primer filtro.',
    avatar: '/agents/recruiter.jpg',
    color: 'amber',
    accentColor: '#f59e0b'
  },
  hiring_manager: {
    id: 'hiring_manager',
    name: 'The Hiring Manager',
    title: 'Senior Hiring Director',
    motto: 'I hire people. I build legacy · Find leaders, Build teams, Drive impact, Deliver results',
    roleDescription: 'Convierte tareas pasivas en logros de alto impacto con métricas cuantificables (formato STAR / Google XYZ).',
    avatar: '/agents/hiring-manager.jpg',
    color: 'green',
    accentColor: '#22c55e'
  },
  rewriter: {
    id: 'rewriter',
    name: 'The Rewriter',
    title: 'Executive Storyteller & Polish Master',
    motto: 'Stronger resumes. Better opportunities · Analyze, Rewrite, Optimize, Elevate',
    roleDescription: 'Reescribe el CV con prosa ejecutiva, vocabulario de alto nivel, jerarquía visual y genera el documento final.',
    avatar: '/agents/rewriter.jpg',
    color: 'red',
    accentColor: '#ef4444'
  }
}
