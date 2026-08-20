import { NextRequest, NextResponse } from 'next/server'
import { runOrchestratorChat } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { messages, userApiKey, extractedFileContent, photoUrl } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'El historial de mensajes es requerido' },
        { status: 400 }
      )
    }

    const response = await runOrchestratorChat({
      messages,
      userApiKey,
      extractedFileContent,
      photoUrl
    })

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: error?.message || 'Ocurrió un error al procesar el mensaje con Gemini' },
      { status: 500 }
    )
  }
}
