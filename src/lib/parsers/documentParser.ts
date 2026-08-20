import mammoth from 'mammoth'

/**
 * Loads Mozilla's official PDF.js dynamically in browser
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
 * Universal PDF extractor using Mozilla PDF.js with page rendering & binary fallback
 */
export async function parsePdfArrayBuffer(arrayBuffer: ArrayBuffer): Promise<{
  text: string
  photoUrl?: string
}> {
  // Strategy 1: Dynamic Mozilla PDF.js with first page image snapshot for photo extraction
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
    let photoUrl: string | undefined = undefined

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum)
      const textContent = await page.getTextContent()
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ')
      fullText += pageText + '\n\n'

      // Render Page 1 to canvas to extract profile photo snapshot if available
      if (pageNum === 1 && typeof document !== 'undefined') {
        try {
          const viewport = page.getViewport({ scale: 2.0 })
          const canvas = document.createElement('canvas')
          const context = canvas.getContext('2d')
          canvas.height = viewport.height
          canvas.width = viewport.width

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise
            // Crop top-left portrait area where CV photo is located with generous framing
            const photoCanvas = document.createElement('canvas')
            photoCanvas.width = 400
            photoCanvas.height = 480
            const photoCtx = photoCanvas.getContext('2d')
            if (photoCtx) {
              photoCtx.drawImage(
                canvas,
                canvas.width * 0.05,
                canvas.height * 0.04,
                canvas.width * 0.32,
                canvas.height * 0.30,
                0,
                0,
                400,
                480
              )
              photoUrl = photoCanvas.toDataURL('image/jpeg', 0.92)
            }
          }
        } catch (renderErr) {
          console.warn('Could not snapshot PDF page 1 for photo:', renderErr)
        }
      }
    }

    if (fullText.trim().length > 10) {
      return { text: fullText.trim(), photoUrl }
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
        return { text: extracted }
      }
    }

    const cleaned = rawString.replace(/[^\w\s.,;:()@/+-]/g, ' ').replace(/\s{2,}/g, ' ')
    if (cleaned.length > 50) {
      return { text: cleaned.slice(0, 5000) }
    }
  } catch (fallbackErr) {
    console.error('Binary PDF stream extraction failed:', fallbackErr)
  }

  throw new Error('No se pudo extraer texto del PDF. Por favor verifica que el archivo contenga texto legible.')
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

  throw new Error('No se pudo leer el archivo Word (.docx).')
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
    const parsedPdf = await parsePdfArrayBuffer(arrayBuffer)
    return { text: parsedPdf.text, fileType, photoUrl: parsedPdf.photoUrl }
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
