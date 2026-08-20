import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle
} from 'docx'
import { StructuredResume } from '@/types'

export async function generateDocxResume(resume: StructuredResume): Promise<Blob> {
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

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              bottom: 720,
              left: 720,
              right: 720
            }
          }
        },
        children: [
          // Header - Full Name
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: (personalInfo.fullName || 'CANDIDATO').toUpperCase(),
                bold: true,
                size: 30,
                color: '1E293B',
                font: 'Calibri'
              })
            ]
          }),
          // Professional Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: personalInfo.title || '',
                size: 22,
                bold: true,
                color: '0F766E',
                font: 'Calibri'
              })
            ],
            spacing: { after: 100 }
          }),
          // Contact line
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: [
                  personalInfo.email,
                  personalInfo.phone,
                  personalInfo.location,
                  personalInfo.linkedin
                ]
                  .filter(Boolean)
                  .join('  •  '),
                size: 18,
                color: '64748B',
                font: 'Calibri'
              })
            ],
            spacing: { after: 200 }
          }),

          // Professional Summary
          ...(personalInfo.summary
            ? [
                new Paragraph({
                  text: 'PERFIL PROFESIONAL',
                  heading: HeadingLevel.HEADING_2,
                  border: {
                    bottom: {
                      color: '0F766E',
                      space: 4,
                      style: BorderStyle.SINGLE,
                      size: 12
                    }
                  },
                  spacing: { before: 180, after: 80 }
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: personalInfo.summary,
                      size: 20,
                      font: 'Calibri'
                    })
                  ],
                  spacing: { after: 180 }
                })
              ]
            : []),

          // Work Experience
          ...(workExperience.length > 0
            ? [
                new Paragraph({
                  text: 'EXPERIENCIA PROFESIONAL',
                  heading: HeadingLevel.HEADING_2,
                  border: {
                    bottom: {
                      color: '0F766E',
                      space: 4,
                      style: BorderStyle.SINGLE,
                      size: 12
                    }
                  },
                  spacing: { before: 180, after: 80 }
                }),
                ...workExperience.flatMap((exp) => [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: exp.role || 'Rol',
                        bold: true,
                        size: 22,
                        color: '0F172A',
                        font: 'Calibri'
                      }),
                      new TextRun({
                        text: `  |  ${exp.company || ''}`,
                        bold: true,
                        size: 22,
                        color: '0F766E',
                        font: 'Calibri'
                      }),
                      new TextRun({
                        text: `  (${exp.startDate || ''} - ${exp.current ? 'Presente' : exp.endDate || ''}${exp.location ? ` | ${exp.location}` : ''})`,
                        italics: true,
                        size: 18,
                        color: '64748B',
                        font: 'Calibri'
                      })
                    ],
                    spacing: { before: 100, after: 40 }
                  }),
                  ...(Array.isArray(exp.achievements)
                    ? exp.achievements.map(
                        (ach) =>
                          new Paragraph({
                            bullet: { level: 0 },
                            children: [
                              new TextRun({
                                text: ach,
                                size: 20,
                                font: 'Calibri'
                              })
                            ],
                            spacing: { after: 30 }
                          })
                      )
                    : [])
                ])
              ]
            : []),

          // Education
          ...(education.length > 0
            ? [
                new Paragraph({
                  text: 'EDUCACIÓN & FORMACIÓN',
                  heading: HeadingLevel.HEADING_2,
                  border: {
                    bottom: {
                      color: '0F766E',
                      space: 4,
                      style: BorderStyle.SINGLE,
                      size: 12
                    }
                  },
                  spacing: { before: 180, after: 80 }
                }),
                ...education.map(
                  (edu) =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `${edu.degree || ''} ${edu.fieldOfStudy ? `en ${edu.fieldOfStudy}` : ''}`,
                          bold: true,
                          size: 20,
                          font: 'Calibri'
                        }),
                        new TextRun({
                          text: ` — ${edu.institution || ''} (${edu.startDate || ''} - ${edu.endDate || ''})`,
                          size: 18,
                          color: '64748B',
                          font: 'Calibri'
                        })
                      ],
                      spacing: { after: 50 }
                    })
                )
              ]
            : []),

          // Skills
          ...(technicalSkills.length > 0 || toolsSkills.length > 0 || softSkills.length > 0
            ? [
                new Paragraph({
                  text: 'HABILIDADES & COMPETENCIAS',
                  heading: HeadingLevel.HEADING_2,
                  border: {
                    bottom: {
                      color: '0F766E',
                      space: 4,
                      style: BorderStyle.SINGLE,
                      size: 12
                    }
                  },
                  spacing: { before: 180, after: 80 }
                }),
                ...(technicalSkills.length > 0
                  ? [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Técnicas: ', bold: true, size: 20, font: 'Calibri' }),
                          new TextRun({ text: technicalSkills.join(', '), size: 20, font: 'Calibri' })
                        ],
                        spacing: { after: 30 }
                      })
                    ]
                  : []),
                ...(toolsSkills.length > 0
                  ? [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Herramientas: ', bold: true, size: 20, font: 'Calibri' }),
                          new TextRun({ text: toolsSkills.join(', '), size: 20, font: 'Calibri' })
                        ],
                        spacing: { after: 30 }
                      })
                    ]
                  : []),
                ...(softSkills.length > 0
                  ? [
                      new Paragraph({
                        children: [
                          new TextRun({ text: 'Liderazgo: ', bold: true, size: 20, font: 'Calibri' }),
                          new TextRun({ text: softSkills.join(', '), size: 20, font: 'Calibri' })
                        ],
                        spacing: { after: 30 }
                      })
                    ]
                  : [])
              ]
            : [])
        ]
      }
    ]
  })

  return await Packer.toBlob(doc)
}
