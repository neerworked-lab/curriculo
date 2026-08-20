export type AgentId = 'orchestrator' | 'diagnoser' | 'recruiter' | 'hiring_manager' | 'rewriter'

export interface AgentInfo {
  id: AgentId
  name: string
  title: string
  motto: string
  roleDescription: string
  avatar: string
  color: string
  accentColor: string
}

export interface Attachment {
  name: string
  type: 'pdf' | 'docx' | 'image' | 'text'
  url?: string
  size?: number
  content?: string
}

export interface StructuredResume {
  personalInfo: {
    fullName: string
    title: string
    email: string
    phone: string
    location: string
    linkedin?: string
    github?: string
    website?: string
    photoUrl?: string
    summary: string
  }
  targetRole?: string
  atsScore?: {
    overall: number
    keywordMatch: number
    formatting: number
    impactScore: number
    strengths: string[]
    improvements: string[]
  }
  workExperience: Array<{
    id: string
    company: string
    role: string
    location?: string
    startDate: string
    endDate: string
    current: boolean
    achievements: string[]
    technologies?: string[]
  }>
  education: Array<{
    id: string
    institution: string
    degree: string
    fieldOfStudy: string
    startDate: string
    endDate: string
    grade?: string
  }>
  skills: {
    technical: string[]
    tools: string[]
    soft: string[]
    languages: string[]
  }
  certifications?: Array<{
    name: string
    issuer: string
    date: string
    url?: string
  }>
  projects?: Array<{
    name: string
    description: string
    role?: string
    link?: string
    highlights: string[]
  }>
}

export interface AgentFinding {
  agentId: AgentId
  agentName: string
  status: 'idle' | 'analyzing' | 'completed' | 'error'
  title: string
  summary: string
  details: string[]
  score?: number
  metrics?: Record<string, string | number>
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'orchestrator' | 'system'
  text: string
  timestamp: string
  attachments?: Attachment[]
  agentFindings?: AgentFinding[]
  structuredResume?: StructuredResume
  options?: string[]
  isStreaming?: boolean
}
