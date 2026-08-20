import pptxgen from 'pptxgenjs'
import { StructuredResume } from '@/types'

export async function generatePptxResume(resume: StructuredResume): Promise<Buffer> {
  const pptx = new pptxgen()
  pptx.layout = 'LAYOUT_16x9'

  // Slide 1: Executive Profile & Career Highlights
  const slide1 = pptx.addSlide()
  slide1.background = { color: '0F172A' } // Dark luxury background

  // Header Banner
  slide1.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 0.5,
    w: 12.33,
    h: 1.4,
    fill: { color: '1E293B' },
    line: { color: '10B981', width: 2 }
  })

  // Full Name & Title
  slide1.addText(resume.personalInfo.fullName.toUpperCase(), {
    x: 0.8,
    y: 0.65,
    w: 8.0,
    h: 0.5,
    fontSize: 24,
    bold: true,
    color: 'FFFFFF',
    fontFace: 'Arial'
  })

  slide1.addText(resume.personalInfo.title, {
    x: 0.8,
    y: 1.15,
    w: 8.0,
    h: 0.4,
    fontSize: 16,
    bold: true,
    color: '10B981',
    fontFace: 'Arial'
  })

  // Contact Info Badge
  slide1.addText(
    `${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.location}`,
    {
      x: 0.8,
      y: 1.5,
      w: 11.5,
      h: 0.3,
      fontSize: 10,
      color: '94A3B8'
    }
  )

  // ATS Score badge if available
  if (resume.atsScore) {
    slide1.addShape(pptx.ShapeType.roundRect, {
      x: 10.0,
      y: 0.65,
      w: 2.5,
      h: 1.1,
      fill: { color: '064E3B' },
      line: { color: '10B981', width: 1.5 }
    })
    slide1.addText(`ATS SCORE: ${resume.atsScore.overall}%`, {
      x: 10.0,
      y: 0.75,
      w: 2.5,
      h: 0.4,
      fontSize: 13,
      bold: true,
      align: 'center',
      color: '34D399'
    })
    slide1.addText('Auditado por Agentes IA', {
      x: 10.0,
      y: 1.15,
      w: 2.5,
      h: 0.3,
      fontSize: 9,
      align: 'center',
      color: 'A7F3D0'
    })
  }

  // Left Column: Executive Summary & Skills
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 0.5,
    y: 2.1,
    w: 4.5,
    h: 4.8,
    fill: { color: '1E293B' },
    line: { color: '334155', width: 1 }
  })

  slide1.addText('PERFIL EJECUTIVO', {
    x: 0.7,
    y: 2.2,
    w: 4.1,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: '38BDF8'
  })

  slide1.addText(resume.personalInfo.summary, {
    x: 0.7,
    y: 2.55,
    w: 4.1,
    h: 1.8,
    fontSize: 10,
    color: 'E2E8F0',
    lineSpacing: 14
  })

  slide1.addText('HABILIDADES & STACK', {
    x: 0.7,
    y: 4.4,
    w: 4.1,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: '38BDF8'
  })

  const skillBullets = [
    `• Técnicas: ${resume.skills.technical.slice(0, 5).join(', ')}`,
    `• Herramientas: ${resume.skills.tools.slice(0, 5).join(', ')}`,
    `• Liderazgo: ${resume.skills.soft.slice(0, 4).join(', ')}`,
    `• Idiomas: ${resume.skills.languages.join(', ')}`
  ].join('\n\n')

  slide1.addText(skillBullets, {
    x: 0.7,
    y: 4.75,
    w: 4.1,
    h: 2.0,
    fontSize: 10,
    color: 'CBD5E1'
  })

  // Right Column: Experience & Achievements (STAR)
  slide1.addShape(pptx.ShapeType.roundRect, {
    x: 5.2,
    y: 2.1,
    w: 7.63,
    h: 4.8,
    fill: { color: '1E293B' },
    line: { color: '334155', width: 1 }
  })

  slide1.addText('TRAYECTORIA & LOGROS CUANTIFICABLES (STAR)', {
    x: 5.4,
    y: 2.2,
    w: 7.2,
    h: 0.3,
    fontSize: 12,
    bold: true,
    color: '34D399'
  })

  let currentY = 2.6
  resume.workExperience.slice(0, 3).forEach((exp) => {
    slide1.addText(`${exp.role} — ${exp.company} (${exp.startDate} - ${exp.current ? 'Presente' : exp.endDate})`, {
      x: 5.4,
      y: currentY,
      w: 7.2,
      h: 0.25,
      fontSize: 11,
      bold: true,
      color: 'F8FAFC'
    })
    currentY += 0.28

    exp.achievements.slice(0, 2).forEach((ach) => {
      slide1.addText(`• ${ach}`, {
        x: 5.6,
        y: currentY,
        w: 7.0,
        h: 0.38,
        fontSize: 9.5,
        color: '94A3B8'
      })
      currentY += 0.4
    })
    currentY += 0.1
  })

  const arrayBuffer = (await pptx.write({ outputType: 'arraybuffer' })) as ArrayBuffer
  return Buffer.from(arrayBuffer)
}
