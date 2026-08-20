import { jsPDF } from 'jspdf'
import { StructuredResume } from '@/types'

export function generatePdfResume(resume: StructuredResume): Uint8Array {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const personalInfo = resume.personalInfo || {
    fullName: 'Candidato Profesional',
    title: 'Especialista',
    email: '',
    phone: '',
    location: '',
    summary: ''
  }

  const workExperience = Array.isArray(resume.workExperience) ? resume.workExperience : []
  const education = Array.isArray(resume.education) ? resume.education : []

  let technicalSkills: string[] = []
  let toolsSkills: string[] = []
  let softSkills: string[] = []
  let languagesSkills: string[] = []

  if (Array.isArray(resume.skills)) {
    technicalSkills = resume.skills as any
  } else if (resume.skills && typeof resume.skills === 'object') {
    technicalSkills = Array.isArray(resume.skills.technical) ? resume.skills.technical : []
    toolsSkills = Array.isArray(resume.skills.tools) ? resume.skills.tools : []
    softSkills = Array.isArray(resume.skills.soft) ? resume.skills.soft : []
    languagesSkills = Array.isArray(resume.skills.languages) ? resume.skills.languages : []
  }

  // Margins
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
  doc.setFontSize(16)
  doc.text((personalInfo.fullName || 'CANDIDATO').toUpperCase(), margin + 6, y + 10)

  // Title
  doc.setTextColor(16, 185, 129) // Emerald
  doc.setFontSize(11)
  doc.text(personalInfo.title || '', margin + 6, y + 18)

  // Contact info
  doc.setTextColor(148, 163, 184) // Slate 400
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  const contactText = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin
  ]
    .filter(Boolean)
    .join('  |  ')
  doc.text(contactText, margin + 6, y + 26)

  y += 38

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

  const renderSectionHeader = (title: string) => {
    doc.setTextColor(15, 23, 42)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(title, margin, y)
    y += 2
    doc.setDrawColor(16, 185, 129)
    doc.setLineWidth(0.6)
    doc.line(margin, y, margin + contentWidth, y)
    y += 5.5
  }

  // Summary
  if (personalInfo.summary) {
    renderSectionHeader('PERFIL PROFESIONAL')
    doc.setTextColor(51, 65, 85)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    const summaryLines = doc.splitTextToSize(personalInfo.summary, contentWidth)
    doc.text(summaryLines, margin, y)
    y += summaryLines.length * 4.2 + 4
  }

  // Experience
  if (workExperience.length > 0) {
    renderSectionHeader('EXPERIENCIA PROFESIONAL')
    workExperience.forEach((exp) => {
      if (y > 260) {
        doc.addPage()
        y = 18
      }

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9.5)
      doc.setTextColor(15, 23, 42)
      doc.text(exp.role || 'Rol', margin, y)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(15, 118, 110)
      doc.text(` — ${exp.company || ''}`, margin + doc.getTextWidth(exp.role || 'Rol'), y)

      const dateText = `${exp.startDate || ''} - ${exp.current ? 'Presente' : exp.endDate || ''}`
      doc.setTextColor(100, 116, 139)
      doc.setFontSize(8.5)
      doc.text(dateText, pageWidth - margin - doc.getTextWidth(dateText), y)
      y += 4.5

      if (Array.isArray(exp.achievements)) {
        exp.achievements.forEach((ach) => {
          if (y > 268) {
            doc.addPage()
            y = 18
          }
          doc.setTextColor(51, 65, 85)
          doc.setFontSize(8.5)
          const bulletLines = doc.splitTextToSize(`•  ${ach}`, contentWidth - 4)
          doc.text(bulletLines, margin + 2, y)
          y += bulletLines.length * 4.0
        })
      }
      y += 2
    })
  }

  // Education
  if (education.length > 0) {
    if (y > 245) {
      doc.addPage()
      y = 18
    }
    renderSectionHeader('EDUCACIÓN & FORMACIÓN')
    education.forEach((edu) => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(15, 23, 42)
      doc.text(`${edu.degree || ''} ${edu.fieldOfStudy ? `en ${edu.fieldOfStudy}` : ''}`, margin, y)

      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 116, 139)
      doc.setFontSize(8.5)
      const eduDate = `${edu.institution || ''} (${edu.startDate || ''} - ${edu.endDate || ''})`
      doc.text(eduDate, pageWidth - margin - doc.getTextWidth(eduDate), y)
      y += 5
    })
  }

  // Skills
  if (technicalSkills.length > 0 || toolsSkills.length > 0 || softSkills.length > 0) {
    if (y > 250) {
      doc.addPage()
      y = 18
    }
    y += 2
    renderSectionHeader('HABILIDADES & COMPETENCIAS')
    doc.setFontSize(8.5)

    if (technicalSkills.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('Técnicas: ', margin, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(51, 65, 85)
      doc.text(technicalSkills.join(', '), margin + 20, y)
      y += 4.5
    }

    if (toolsSkills.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('Herramientas: ', margin, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(51, 65, 85)
      doc.text(toolsSkills.join(', '), margin + 25, y)
      y += 4.5
    }

    if (softSkills.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text('Liderazgo: ', margin, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(51, 65, 85)
      doc.text(softSkills.join(', '), margin + 20, y)
      y += 4.5
    }
  }

  const arrayBuffer = doc.output('arraybuffer')
  return new Uint8Array(arrayBuffer)
}
