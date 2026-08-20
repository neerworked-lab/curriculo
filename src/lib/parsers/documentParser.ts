import mammoth from 'mammoth'

export async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  try {
    const pdfModule: any = await import('pdf-parse')
    const pdfParse = pdfModule.default || pdfModule
    const data = await pdfParse(buffer)
    return data.text || ''
  } catch (error: any) {
    console.error('Error parsing PDF:', error)
    throw new Error(`Error al leer el archivo PDF: ${error?.message || error}`)
  }
}

export async function parseDocxBuffer(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer })
    return result.value || ''
  } catch (error: any) {
    console.error('Error parsing DOCX:', error)
    throw new Error(`Error al leer el archivo Word: ${error?.message || error}`)
  }
}

export async function parseUploadedFile(file: File): Promise<{ text: string; fileType: 'pdf' | 'docx' | 'image' | 'text'; photoUrl?: string }> {
  const fileType = file.name.endsWith('.pdf')
    ? 'pdf'
    : file.name.endsWith('.docx') || file.name.endsWith('.doc')
    ? 'docx'
    : file.type.startsWith('image/')
    ? 'image'
    : 'text'

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  if (fileType === 'pdf') {
    const text = await parsePdfBuffer(buffer)
    return { text, fileType }
  }

  if (fileType === 'docx') {
    const text = await parseDocxBuffer(buffer)
    return { text, fileType }
  }

  if (fileType === 'image') {
    const base64 = buffer.toString('base64')
    const photoUrl = `data:${file.type};base64,${base64}`
    return { text: '[FOTO_ADJUNTA]', fileType, photoUrl }
  }

  // Plain text
  return { text: buffer.toString('utf-8'), fileType: 'text' }
}
