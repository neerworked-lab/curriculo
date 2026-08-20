import { NextRequest, NextResponse } from 'next/server'
import { runCompleteAgentPipeline } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { resumeRawText, targetRole, userApiKey, photoUrl } = body

    if (!resumeRawText || typeof resumeRawText !== 'string') {
      return NextResponse.json(
        { error: 'El contenido del currículum es requerido' },
        { status: 400 }
      )
    }

    const result = await runCompleteAgentPipeline({
      resumeRawText,
      targetRole,
      userApiKey,
      photoUrl
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Pipeline API Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al ejecutar el pipeline de los 4 agentes' },
      { status: 500 }
    )
  }
}
