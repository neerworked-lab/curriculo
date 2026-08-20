import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Currículum Vitae · Cuatro Agentes IA',
  description: 'Crea, audita y optimiza tu currículum vitae con 4 agentes especializados (The Diagnoser, The Recruiter, The Hiring Manager, The Rewriter) y The Orchestrator con Google Gemini.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark h-full">
      <body className="h-full bg-slate-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  )
}
