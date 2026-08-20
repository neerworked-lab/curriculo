import { jsPDF } from 'jspdf'
import { StructuredResume } from '@/types'

export function generatePdfResume(resume: StructuredResume): Buffer {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const { personalInfo, workExperience, education, skills } = resume

  // Background styling / margins
  const margin = 15
  const pageWidth = 210
  const contentWidth = pageWidth - margin * 2

  let y = 18

  // Header Banner
  doc.setFillColor(15, 23, 42) // Slate 900
  doc.rect(margin, y, contentWidth, 32, 'F')

  // Name
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text(personalInfo.fullName.toUpperCase(), margin + 6, y + 10)

  // Title
  doc.setTextColor(16, 185, 129) // Emerald
  doc.setFontSize(12)
  doc.text(personalInfo.title, margin + 6, y + 18)

  // Contact info
  doc.setTextColor(148, 163, 184) // Slate 400
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  const contactText = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin
  ]
    .filter(Boolean)
    .join('  |  ')
  doc.text(contactText, margin + 6, y + 26)

  y += 40

  // ATS Badge
  if (resume.atsScore) {
    doc.setFillColor(6, 78, 59)
    doc.roundedRect(pageWidth - margin - 35, 20, 32, 14, 2, 2, 'F')
    doc.setTextColor(52, 211, 153)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(`ATS Score: ${resume.atsScore.overall}%`, pageWidth - margin - 33, 26)
    doc.setFontSize(7)
    doc.text('Audited by AI Panel', pageWidth - margin - 33, 31)
  }

  // Section helper
  const renderSectionHeader = (title: string) => {
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(title, margin, y)
    y += 2
    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.6)
    doc.line(margin, y, margin + contentWidth, y)
    y += 6
  }

  // Summary
  renderSectionHeader('PERFIL PROFESIONAL')
  doc.setTextColor(51, 65, 85)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  const summaryLines = doc.splitTextToSize(personalInfo.summary, contentWidth)
  doc.text(summaryLines, margin, y)
  y += summaryLines.length * 4.5 + 4

  // Experience
  renderSectionHeader('EXPERIENCIA PROFESIONAL')
  workExperience.forEach((exp) => {
    if (y > 265) {
      doc.addPage()
      y = 18
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(15, 23, 42)
    doc.text(exp.role, margin, y)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(15, 118, 110)
    doc.text(` — ${exp.company}`, margin + doc.getTextWidth(exp.role), y)

    const dateText = `${exp.startDate} - ${exp.current ? 'Presente' : exp.endDate}`
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(8.5)
    doc.text(dateText, pageWidth - margin - doc.getTextWidth(dateText), y)
    y += 5

    exp.achievements.forEach((ach) => {
      if (y > 270) {
        doc.addPage()
        y = 18
      }
      doc.setTextColor(51, 65, 85)
      doc.setFontSize(9)
      const bulletLines = doc.splitTextToSize(`•  ${ach}`, contentWidth - 4)
      doc.text(bulletLines, margin + 2, y)
      y += bulletLines.length * 4.2
    })
    y += 2.5
  })

  // Education
  if (y > 250) {
    doc.addPage()
    y = 18
  }
  renderSectionHeader('EDUCACIÓN')
  education.forEach((edu) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(15, 23, 42)
    doc.text(`${edu.degree} en ${edu.fieldOfStudy}`, margin, y)

    doc.setFont('helvetica', 'normal')
    doc.setTextColor(100, 116, 139)
    doc.setFontSize(8.5)
    const eduDate = `${edu.institution} (${edu.startDate} - ${edu.endDate})`
    doc.text(eduDate, pageWidth - margin - doc.getTextWidth(eduDate), y)
    y += 5.5
  })

  // Skills
  if (y > 255) {
    doc.addPage()
    y = 18
  }
  y += 2
  renderSectionHeader('HABILIDADES & COMPETENCIAS')
  doc.setFontSize(9)
  
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('Técnicas: ', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(51, 65, 85)
  doc.text(skills.technical.join(', '), margin + 20, y)
  y += 4.5

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('Herramientas: ', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(51, 65, 85)
  doc.text(skills.tools.join(', '), margin + 25, y)
  y += 4.5

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('Liderazgo: ', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(51, 65, 85)
  doc.text(skills.soft.join(', '), margin + 20, y)
  y += 4.5

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text('Idiomas: ', margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(51, 65, 85)
  doc.text(skills.languages.join(', '), margin + 18, y)

  const arrayBuffer = doc.output('arraybuffer')
  return Buffer.from(arrayBuffer)
}
