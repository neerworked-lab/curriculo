import mammoth from 'mammoth'

/**
 * Loads Mozilla's official PDF.js dynamically in browser without bundling Node canvas
 */
function getBrowserPdfJs(): Promise<any> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('PDF.js client-only'))
  }

  if ((window as any).pdfjsLib) {
    return Promise.resolve((window as any).pdfjsLib)
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById('pdfjs-cdn-script')
    if (existingScript) {
      const checkInterval = setInterval(() => {
        if ((window as any).pdfjsLib) {
          clearInterval(checkInterval)
          resolve((window as any).pdfjsLib)
        }
      }, 50)
      setTimeout(() => {
        clearInterval(checkInterval)
        if ((window as any).pdfjsLib) resolve((window as any).pdfjsLib)
        else reject(new Error('PDF.js script timeout'))
      }, 3000)
      return
    }

    const script = document.createElement('script')
    script.id = 'pdfjs-cdn-script'
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'
    script.async = true
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'
        resolve(pdfjs)
      } else {
        reject(new Error('PDF.js not available on window'))
      }
    }
    script.onerror = () => reject(new Error('Failed to load PDF.js from CDN'))
    document.head.appendChild(script)
  })
}

/**
 * Universal PDF extractor using Mozilla PDF.js + Binary Stream Fallback
 */
export async function parsePdfArrayBuffer(arrayBuffer: ArrayBuffer): Promise<string> {
  // Strategy 1: Dynamic Mozilla PDF.js
  try {
    const pdfjsLib = await getBrowserPdfJs()
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
    console.warn('PDF.js dynamic load failed, using binary stream extractor:', pdfErr)
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

    const textMatches =
      rawString.match(/\(([^\\)]{2,})\)\s*(?:Tj|TJ|')/g) || rawString.match(/\(([^()]{3,})\)/g)
    if (textMatches && textMatches.length > 0) {
      const extracted = textMatches
        .map((chunk) => chunk.replace(/[\\()]/g, ' ').replace(/\s+/g, ' ').trim())
        .filter((chunk) => chunk.length > 2)
        .join('\n')

      if (extracted.trim().length > 20) {
        return extracted
      }
    }

    const cleaned = rawString.replace(/[^\w\s.,;:()@/+-]/g, ' ').replace(/\s{2,}/g, ' ')
    if (cleaned.length > 50) {
      return cleaned.slice(0, 5000)
    }
  } catch (fallbackErr) {
    console.error('Binary PDF stream extraction failed:', fallbackErr)
  }

  throw new Error('No se pudo extraer texto del PDF. Por favor verifica que no esté protegido o sube tu CV en formato Word.')
}

/**
 * Universal DOCX text extractor
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

  // Fallback: decode raw XML structure
  try {
    const decoded = new TextDecoder('utf-8').decode(arrayBuffer)
    const textMatches = decoded.match(/<w:t[^>]*>([^<]+)<\/w:t>/g)
    if (textMatches && textMatches.length > 0) {
      return textMatches.map((m) => m.replace(/<[^>]+>/g, '')).join(' ')
    }
  } catch (err) {
    console.error('DOCX fallback failed:', err)
  }

  throw new Error('No se pudo leer el archivo Word (.docx). Asegúrate de que sea un archivo válido.')
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
