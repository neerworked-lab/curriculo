import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType
} from 'docx'
import { StructuredResume } from '@/types'

export async function generateDocxResume(resume: StructuredResume): Promise<Buffer> {
  const { personalInfo, workExperience, education, skills, certifications, projects } = resume

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
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
                text: personalInfo.fullName.toUpperCase(),
                bold: true,
                size: 32, // 16pt
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
                text: personalInfo.title,
                size: 24, // 12pt
                bold: true,
                color: '0F766E',
                font: 'Calibri'
              })
            ],
            spacing: { after: 120 }
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
                  personalInfo.linkedin,
                  personalInfo.github
                ]
                  .filter(Boolean)
                  .join('  •  '),
                size: 18,
                color: '64748B',
                font: 'Calibri'
              })
            ],
            spacing: { after: 240 }
          }),

          // Professional Summary Header
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
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: personalInfo.summary,
                size: 20,
                font: 'Calibri'
              })
            ],
            spacing: { after: 200 }
          }),

          // Work Experience Header
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
            spacing: { before: 200, after: 100 }
          }),
          ...workExperience.flatMap((exp) => [
            new Paragraph({
              children: [
                new TextRun({
                  text: exp.role,
                  bold: true,
                  size: 22,
                  color: '0F172A',
                  font: 'Calibri'
                }),
                new TextRun({
                  text: `  |  ${exp.company}`,
                  bold: true,
                  size: 22,
                  color: '0F766E',
                  font: 'Calibri'
                }),
                new TextRun({
                  text: `  (${exp.startDate} - ${exp.current ? 'Presente' : exp.endDate}${exp.location ? ` | ${exp.location}` : ''})`,
                  italics: true,
                  size: 18,
                  color: '64748B',
                  font: 'Calibri'
                })
              ],
              spacing: { before: 120, after: 60 }
            }),
            ...exp.achievements.map(
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
                  spacing: { after: 40 }
                })
            )
          ]),

          // Education Header
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
            spacing: { before: 200, after: 100 }
          }),
          ...education.map(
            (edu) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${edu.degree} en ${edu.fieldOfStudy}`,
                    bold: true,
                    size: 20,
                    font: 'Calibri'
                  }),
                  new TextRun({
                    text: ` — ${edu.institution} (${edu.startDate} - ${edu.endDate})`,
                    size: 18,
                    color: '64748B',
                    font: 'Calibri'
                  })
                ],
                spacing: { after: 60 }
              })
          ),

          // Skills Header
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
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Técnicas: ', bold: true, size: 20, font: 'Calibri' }),
              new TextRun({ text: skills.technical.join(', '), size: 20, font: 'Calibri' })
            ],
            spacing: { after: 40 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Herramientas: ', bold: true, size: 20, font: 'Calibri' }),
              new TextRun({ text: skills.tools.join(', '), size: 20, font: 'Calibri' })
            ],
            spacing: { after: 40 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Competencias Clave: ', bold: true, size: 20, font: 'Calibri' }),
              new TextRun({ text: skills.soft.join(', '), size: 20, font: 'Calibri' })
            ],
            spacing: { after: 40 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Idiomas: ', bold: true, size: 20, font: 'Calibri' }),
              new TextRun({ text: skills.languages.join(', '), size: 20, font: 'Calibri' })
            ],
            spacing: { after: 120 }
          })
        ]
      }
    ]
  })

  return await Packer.toBuffer(doc)
}
