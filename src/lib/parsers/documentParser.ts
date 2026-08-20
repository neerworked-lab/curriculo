import mammoth from 'mammoth'

export async function parseDocxArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    // mammoth supports { arrayBuffer } in both browser and Node.js environments
    const result = await mammoth.extractRawText({ arrayBuffer })
    return result.value || ''
  } catch (error: any) {
    console.error('Error parsing DOCX:', error)
    // Fallback: try buffer if arrayBuffer failed in some node versions
    try {
      const buffer = Buffer.from(arrayBuffer)
      const result = await mammoth.extractRawText({ buffer })
      return result.value || ''
    } catch {
      throw new Error(`Error al leer el archivo Word: ${error?.message || error}`)
    }
  }
}

export async function parsePdfArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const buffer = Buffer.from(arrayBuffer)
    const pdfModule: any = await import('pdf-parse')
    const pdfParse = pdfModule.default || pdfModule
    const data = await pdfParse(buffer)
    return data.text || ''
  } catch (error: any) {
    console.warn('pdf-parse failed, attempting text stream extraction:', error)
    // Fallback string extraction for raw PDF streams
    try {
      const bytes = new Uint8Array(arrayBuffer)
      let text = ''
      for (let i = 0; i < bytes.length; i++) {
        const charCode = bytes[i]
        if (charCode >= 32 && charCode <= 126) {
          text += String.fromCharCode(charCode)
        } else if (charCode === 10 || charCode === 13) {
          text += ' '
        }
      }
      // Extract text segments between parentheses (BT / ET blocks)
      const matches = text.match(/\(([^)]+)\)/g)
      if (matches && matches.length > 5) {
        return matches.map((m) => m.slice(1, -1)).join(' ')
      }
      return text.slice(0, 4000)
    } catch {
      throw new Error(`Error al leer el archivo PDF: ${error?.message || error}`)
    }
  }
}

export async function parseUploadedFile(file: File): Promise<{
  text: string
  fileType: 'pdf' | 'docx' | 'image' | 'text'
  photoUrl?: string
}> {
  const fileName = (file.name || '').toLowerCase()
  const fileType = fileName.endsWith('.pdf')
    ? 'pdf'
    : fileName.endsWith('.docx') || fileName.endsWith('.doc')
    ? 'docx'
    : file.type.startsWith('image/')
    ? 'image'
    : 'text'

  const arrayBuffer = await file.arrayBuffer()

  if (fileType === 'docx') {
    const text = await parseDocxArrayBuffer(arrayBuffer)
    return { text, fileType }
  }

  if (fileType === 'pdf') {
    const text = await parsePdfArrayBuffer(arrayBuffer)
    return { text, fileType }
  }

  if (fileType === 'image') {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => {
        const photoUrl = reader.result as string
        resolve({ text: '[FOTO_DE_PERFIL_ADJUNTA]', fileType, photoUrl })
      }
      reader.onerror = () => {
        resolve({ text: '', fileType: 'image' })
      }
      reader.readAsDataURL(file)
    })
  }

  // Plain text / Markdown / txt
  const text = new TextDecoder('utf-8').decode(arrayBuffer)
  return { text, fileType: 'text' }
}
