import mammoth from 'mammoth'

/**
 * Universal PDF text extractor for browser & mobile environments
 */
export async function parsePdfArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  // Strategy 1: Use Mozilla's pdfjs-dist
  try {
    const pdfjsLib = await import('pdfjs-dist/build/pdf')
    
    // Configure worker via CDN for client-side bundle isolation
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`
    }

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    })

    const pdfDoc = await loadingTask.promise
    let fullText = ''

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ')
      fullText += pageText + '\n\n'
    }

    if (fullText.trim().length > 10) {
      return fullText.trim()
    }
  } catch (pdfErr) {
    console.warn('pdfjs-dist strategy failed, falling back to binary stream extraction:', pdfErr)
  }

  // Strategy 2: Resilient Native Binary PDF Stream Extractor
  try {
    const bytes = new Uint8Array(arrayBuffer)
    let rawString = ''
    for (let i = 0; i < bytes.length; i++) {
      const code = bytes[i]
      if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9) {
        rawString += String.fromCharCode(code)
      } else {
        rawString += ' '
      }
    }

    // Match text blocks inside PDF (Tj, TJ, and text between parentheses)
    const textMatches = rawString.match(/\(([^\\)]{2,})\)\s*(?:Tj|TJ|')/g) || rawString.match(/\(([^()]{3,})\)/g)
    if (textMatches && textMatches.length > 0) {
      const extracted = textMatches
        .map((chunk) => chunk.replace(/[\\()]/g, ' ').replace(/\s+/g, ' ').trim())
        .filter((chunk) => chunk.length > 2)
        .join('\n')

      if (extracted.trim().length > 20) {
        return extracted
      }
    }

    // Cleaned printable text fallback
    const cleaned = rawString.replace(/[^\w\s.,;:()@/+-]/g, ' ').replace(/\s{2,}/g, ' ')
    if (cleaned.length > 50) {
      return cleaned.slice(0, 5000)
    }
  } catch (fallbackErr) {
    console.error('Binary stream extraction failed:', fallbackErr)
  }

  throw new Error('No se pudo extraer texto legible del PDF. Por favor verifica que el archivo no esté protegido con contraseña.')
}

/**
 * Universal DOCX text extractor for browser & mobile
 */
export async function parseDocxArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer })
    if (result.value && result.value.trim().length > 0) {
      return result.value.trim()
    }
  } catch (err: any) {
    console.warn('Mammoth arrayBuffer failed, trying fallback extraction:', err)
  }

  // Fallback: try raw text decode in case it was a plain text or RTF disguised as doc
  try {
    const decoded = new TextDecoder('utf-8').decode(arrayBuffer)
    const textMatches = decoded.match(/<w:t[^>]*>([^<]+)<\/w:t>/g)
    if (textMatches && textMatches.length > 0) {
      return textMatches.map((m) => m.replace(/<[^>]+>/g, '')).join(' ')
    }
  } catch (err) {
    console.error('DOCX fallback failed:', err)
  }

  throw new Error('No se pudo leer el archivo Word (.docx). Asegúrate de que sea un archivo Word válido.')
}

/**
 * Master file reader handler
 */
export async function parseUploadedFile(file: File): Promise<{
  text: string
  fileType: 'pdf' | 'docx' | 'image' | 'text'
  photoUrl?: string
}> {
  const fileName = (file.name || '').toLowerCase()
  const mimeType = (file.type || '').toLowerCase()

  const isPdf = fileName.endsWith('.pdf') || mimeType.includes('pdf')
  const isDocx =
    fileName.endsWith('.docx') ||
    fileName.endsWith('.doc') ||
    mimeType.includes('word') ||
    mimeType.includes('officedocument')
  const isImage = file.type.startsWith('image/')

  const fileType: 'pdf' | 'docx' | 'image' | 'text' = isPdf
    ? 'pdf'
    : isDocx
    ? 'docx'
    : isImage
    ? 'image'
    : 'text'

  const arrayBuffer = await file.arrayBuffer()

  if (fileType === 'pdf') {
    const text = await parsePdfArrayBuffer(arrayBuffer)
    return { text, fileType }
  }

  if (fileType === 'docx') {
    const text = await parseDocxArrayBuffer(arrayBuffer)
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

  // Plain text / Markdown
  const text = new TextDecoder('utf-8').decode(arrayBuffer)
  return { text, fileType: 'text' }
}
