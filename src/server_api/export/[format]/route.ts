import { NextRequest, NextResponse } from 'next/server'
import { generateDocxResume } from '@/lib/exporters/wordExporter'
import { generatePptxResume } from '@/lib/exporters/pptxExporter'
import { generatePdfResume } from '@/lib/exporters/pdfExporter'
import { StructuredResume } from '@/types'

export function generateStaticParams() {
  return [
    { format: 'pdf' },
    { format: 'docx' },
    { format: 'pptx' }
  ]
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ format: string }> }
) {
  try {
    const { format } = await params
    const body = await req.json()
    const resume: StructuredResume = body.resume

    if (!resume || !resume.personalInfo) {
      return NextResponse.json(
        { error: 'Datos del currículum no proporcionados o inválidos' },
        { status: 400 }
      )
    }

    const safeName = (resume.personalInfo.fullName || 'Curriculum')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase()

    if (format === 'docx' || format === 'word') {
      const buffer = await generateDocxResume(resume)
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'Content-Disposition': `attachment; filename="${safeName}_resume.docx"`
        }
      })
    }

    if (format === 'pptx' || format === 'powerpoint') {
      const buffer = await generatePptxResume(resume)
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'Content-Disposition': `attachment; filename="${safeName}_presentation.pptx"`
        }
      })
    }

    if (format === 'pdf') {
      const buffer = generatePdfResume(resume)
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${safeName}_resume.pdf"`
        }
      })
    }

    return NextResponse.json(
      { error: `Formato '${format}' no soportado. Usa 'docx', 'pptx' o 'pdf'` },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: error?.message || 'Error al generar el archivo exportable' },
      { status: 500 }
    )
  }
}
