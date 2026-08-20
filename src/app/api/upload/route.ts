import { NextRequest, NextResponse } from 'next/server'
import { parseUploadedFile } from '@/lib/parsers/documentParser'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No se envió ningún archivo' },
        { status: 400 }
      )
    }

    const parsedResult = await parseUploadedFile(file)

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      fileType: parsedResult.fileType,
      text: parsedResult.text,
      photoUrl: parsedResult.photoUrl
    })
  } catch (error: any) {
    console.error('Upload parser error:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al procesar el archivo' },
      { status: 500 }
    )
  }
}
