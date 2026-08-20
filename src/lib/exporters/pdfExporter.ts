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
  doc.rect(0, 0, 70, 297, 'F')

  // Left Sidebar Content
  let leftY = 25

  // Left Sidebar Title: DATOS PERSONALES
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(6, leftY, 58, 42, 2, 2, 'F')
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('DATOS PERSONALES', 10, leftY + 7)
  doc.setDrawColor(200, 210, 204)
  doc.line(10, leftY + 9, 60, leftY + 9)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(51, 65, 85)
  if (personalInfo.idNumber) {
    doc.text(`Cédula: ${personalInfo.idNumber}`, 10, leftY + 16)
  }
  if (personalInfo.age) {
    doc.text(`Edad: ${personalInfo.age}`, 10, leftY + 22)
  }
  if (personalInfo.maritalStatus) {
    doc.text(`Estado Civil: ${personalInfo.maritalStatus}`, 10, leftY + 28)
  }
  if (personalInfo.nationality) {
    doc.text(`Nacionalidad: ${personalInfo.nationality}`, 10, leftY + 34)
  }

  leftY += 48

  // Contact Box
  doc.setFillColor(255, 255, 255)
  doc.roundedRect(6, leftY, 58, 38, 2, 2, 'F')
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('CONTACTO', 10, leftY + 7)
  doc.line(10, leftY + 9, 60, leftY + 9)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  if (personalInfo.phone) {
    const phoneLines = doc.splitTextToSize(personalInfo.phone, 50)
    doc.text(phoneLines, 10, leftY + 16)
  }
  if (personalInfo.email) {
    const emailLines = doc.splitTextToSize(personalInfo.email, 50)
    doc.text(emailLines, 10, leftY + 24)
  }
  if (personalInfo.location) {
    const locLines = doc.splitTextToSize(personalInfo.location, 50)
    doc.text(locLines, 10, leftY + 31)
  }

  leftY += 44

  // Education Box
  if (education.length > 0) {
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(6, leftY, 58, 55, 2, 2, 'F')
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text('EDUCACIÓN', 10, leftY + 7)
    doc.line(10, leftY + 9, 60, leftY + 9)

    let eduY = leftY + 15
    education.slice(0, 3).forEach((edu) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7.5)
      doc.setTextColor(15, 23, 42)
      const degText = `${edu.degree} ${edu.fieldOfStudy ? `en ${edu.fieldOfStudy}` : ''}`
      const degLines = doc.splitTextToSize(degText, 50)
      doc.text(degLines, 10, eduY)
      eduY += degLines.length * 3.5

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(6.5)
      doc.setTextColor(100, 116, 139)
      doc.text(edu.institution, 10, eduY)
      eduY += 5
    })
  }

  // Right Main Column
  let rightX = 78
  let rightY = 22
  let rightWidth = 120

  // Header: SINTESIS CURRICULAR
  doc.setTextColor(100, 116, 139)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8)
  doc.text('S Í N T E S I S   C U R R I C U L A R', rightX, rightY)
  rightY += 8

  // Name in Big
  doc.setTextColor(15, 23, 42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text((personalInfo.fullName || 'Basew Asfur').toUpperCase(), rightX, rightY)
  rightY += 6

  // Title
  if (personalInfo.title) {
    doc.setTextColor(6, 95, 70)
    doc.setFontSize(11)
    doc.text(personalInfo.title, rightX, rightY)
    rightY += 5
  }

  doc.setDrawColor(15, 23, 42)
  doc.setLineWidth(0.6)
  doc.line(rightX, rightY, rightX + rightWidth, rightY)
  rightY += 8

  // Summary
  if (personalInfo.summary) {
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.text('PERFIL PROFESIONAL & EJECUTIVO', rightX, rightY)
    rightY += 4.5
    doc.setTextColor(51, 65, 85)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    const summaryLines = doc.splitTextToSize(personalInfo.summary, rightWidth)
    doc.text(summaryLines, rightX, rightY)
    rightY += summaryLines.length * 3.8 + 6
  }

  // Work Experience
  if (workExperience.length > 0) {
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.text('RESPONSABILIDADES & TRAYECTORIA', rightX, rightY)
    rightY += 5

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
      rightY += roleLines.length * 3.8

      if (Array.isArray(exp.achievements)) {
        exp.achievements.forEach((ach) => {
          if (rightY > 270) {
            doc.addPage()
            rightY = 20
          }
          doc.setTextColor(51, 65, 85)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(7.5)
          const achLines = doc.splitTextToSize(`• ${ach}`, rightWidth - 2)
          doc.text(achLines, rightX + 2, rightY)
          rightY += achLines.length * 3.4
        })
      }
      rightY += 3.5
    })
  }

  const arrayBuffer = doc.output('arraybuffer')
  return new Uint8Array(arrayBuffer)
}
