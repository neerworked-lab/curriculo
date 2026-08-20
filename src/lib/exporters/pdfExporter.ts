import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { StructuredResume } from '@/types'

/**
 * Universal Pixel-Perfect PDF Exporter
 * Generates an exact 1:1 replica of the rendered HTML preview matching fonts, colors, and layout.
 */
export async function generatePdfResume(
  resume: StructuredResume,
  targetElement?: HTMLElement | null
): Promise<Uint8Array> {
  // If a DOM element from the preview exists, capture it pixel-by-pixel with html2canvas
  if (targetElement) {
    try {
      // Ensure all images inside targetElement are fully loaded
      const images = Array.from(targetElement.getElementsByTagName('img'))
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve()
          return new Promise((resolve) => {
            img.onload = resolve
            img.onerror = resolve
          })
        })
      )

      const canvas = await html2canvas(targetElement, {
        scale: 2.0, // High-resolution retina capture
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFFFFF',
        logging: false
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.98)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      const imgHeight = (canvasHeight * pdfWidth) / canvasWidth

      let heightLeft = imgHeight
      let position = 0

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pdfHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight, undefined, 'FAST')
        heightLeft -= pdfHeight
      }

      const arrayBuffer = pdf.output('arraybuffer')
      return new Uint8Array(arrayBuffer)
    } catch (htmlCanvasErr) {
      console.warn('html2canvas export fallback to vector jsPDF:', htmlCanvasErr)
    }
  }

  // Fallback programmatic 2-column jsPDF vector renderer
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const personalInfo = resume.personalInfo || {
    fullName: 'Basew Asfur',
    idNumber: '12.424.592',
    title: 'Ingeniero Electricista',
    email: '',
    phone: '',
    location: '',
    summary: ''
  }

  const workExperience = Array.isArray(resume.workExperience) ? resume.workExperience : []
  const education = Array.isArray(resume.education) ? resume.education : []

  // Left Sidebar: Sage Green Background
  doc.setFillColor(220, 228, 223) // #DCE4DF
  doc.rect(0, 0, 75, 297, 'F')

  // Left Sidebar Content
  let leftY = 25

  // Left Sidebar Title: DATOS PERSONALES
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(6, leftY, 63, 44, 2, 2, 'F')
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.text('DATOS PERSONALES', 10, leftY + 8)
  doc.setDrawColor(200, 210, 204)
  doc.line(10, leftY + 10, 65, leftY + 10)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(51, 65, 85)
  if (personalInfo.idNumber) {
    doc.text(`Cédula: ${personalInfo.idNumber}`, 10, leftY + 18)
  }
  if (personalInfo.age) {
    doc.text(`Edad: ${personalInfo.age}`, 10, leftY + 24)
  }
  if (personalInfo.maritalStatus) {
    doc.text(`Estado Civil: ${personalInfo.maritalStatus}`, 10, leftY + 30)
  }
  if (personalInfo.nationality) {
    doc.text(`Nacionalidad: ${personalInfo.nationality}`, 10, leftY + 36)
  }

  leftY += 50

  // Contact Box
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(6, leftY, 63, 40, 2, 2, 'F')
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9.5)
  doc.text('CONTACTO', 10, leftY + 8)
  doc.line(10, leftY + 10, 65, leftY + 10)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  if (personalInfo.phone) {
    const phoneLines = doc.splitTextToSize(personalInfo.phone, 55)
    doc.text(phoneLines, 10, leftY + 18)
  }
  if (personalInfo.email) {
    const emailLines = doc.splitTextToSize(personalInfo.email, 55)
    doc.text(emailLines, 10, leftY + 26)
  }
  if (personalInfo.location) {
    const locLines = doc.splitTextToSize(personalInfo.location, 55)
    doc.text(locLines, 10, leftY + 33)
  }

  leftY += 46

  // Education Box
  if (education.length > 0) {
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(6, leftY, 63, 58, 2, 2, 'F')
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.text('EDUCACIÓN', 10, leftY + 8)
    doc.line(10, leftY + 10, 65, leftY + 10)

    let eduY = leftY + 17
    education.slice(0, 3).forEach((edu) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(15, 23, 42)
      const degText = `${edu.degree} ${edu.fieldOfStudy ? `en ${edu.fieldOfStudy}` : ''}`
      const degLines = doc.splitTextToSize(degText, 55)
      doc.text(degLines, 10, eduY)
      eduY += degLines.length * 3.8

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(100, 116, 139)
      doc.text(edu.institution, 10, eduY)
      eduY += 5.5
    })
  }

  // Right Main Column
  let rightX = 82
  let rightY = 25
  let rightWidth = 118

  // Top Gray Band
  doc.setFillColor(239, 239, 239)
  doc.rect(75, 0, 135, 38, 'F')

  // Header: SINTESIS CURRICULAR
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.text('S Í N T E S I S   C U R R I C U L A R', rightX, 15)

  // Name in Big
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(19)
  doc.text((personalInfo.fullName || 'Basew Asfur').toUpperCase(), rightX, 26)

  // Title
  if (personalInfo.title) {
    doc.setTextColor(6, 95, 70)
    doc.setFontSize(10.5)
    doc.text(personalInfo.title, rightX, 33)
  }

  rightY = 48

  // Summary
  if (personalInfo.summary) {
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('PERFIL PROFESIONAL & EJECUTIVO', rightX, rightY)
    rightY += 5
    doc.setTextColor(51, 65, 85)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    const summaryLines = doc.splitTextToSize(personalInfo.summary, rightWidth)
    doc.text(summaryLines, rightX, rightY)
    rightY += summaryLines.length * 4.2 + 8
  }

  // Work Experience
  if (workExperience.length > 0) {
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('RESPONSABILIDADES & TRAYECTORIA', rightX, rightY)
    rightY += 6

    workExperience.forEach((exp) => {
      if (rightY > 260) {
        doc.addPage()
        rightY = 20
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(15, 23, 42)
      const roleText = `${exp.role} | ${exp.company}`
      const roleLines = doc.splitTextToSize(roleText, rightWidth)
      doc.text(roleLines, rightX, rightY)
      rightY += roleLines.length * 4.0

      if (Array.isArray(exp.achievements)) {
        exp.achievements.forEach((ach) => {
          if (rightY > 270) {
            doc.addPage()
            rightY = 20
          }
          doc.setTextColor(51, 65, 85)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8)
          const achLines = doc.splitTextToSize(`• ${ach}`, rightWidth - 2)
          doc.text(achLines, rightX + 2, rightY)
          rightY += achLines.length * 3.6
        })
      }
      rightY += 4
    })
  }

  const arrayBuffer = doc.output('arraybuffer')
  return new Uint8Array(arrayBuffer)
}
