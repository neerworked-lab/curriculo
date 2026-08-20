export type AgentId = 'diagnoser' | 'recruiter' | 'hiring_manager' | 'rewriter' | 'orchestrator'

export interface AgentInfo {
  id: AgentId
  name: string
  title?: string
  role?: string
  roleDescription?: string
  color?: string
  accentColor?: string
  avatar: string
  description?: string
  motto: string
  capabilities?: string[]
}

export interface Attachment {
  name: string
  type: 'pdf' | 'docx' | 'image' | 'text'
  size: number
  content?: string
  url?: string
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'orchestrator' | AgentId
  text: string
  timestamp: string
  attachments?: Attachment[]
  structuredResume?: StructuredResume
  agentStep?: {
    agentId: AgentId
    agentName: string
    status: 'analyzing' | 'completed'
  }
}

export interface WorkExperience {
  id: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  location?: string
  achievements: string[]
}

export interface Education {
  id: string
  institution: string
  degree: string
  fieldOfStudy?: string
  startDate?: string
  endDate?: string
  grade?: string
}

export interface Certification {
  name: string
  issuer: string
  date?: string
  credentialUrl?: string
}

export interface StructuredResume {
  templateId?: 'original_sidebar' | 'executive' | 'bento' | 'tech' | 'classic'
  personalInfo: {
    fullName: string
    idNumber?: string // Cédula / DNI
    age?: string // Edad
    maritalStatus?: string // Estado civil
    nationality?: string // Nacionalidad
    title: string
    email?: string
    phone?: string
    location?: string
    summary?: string
    photoUrl?: string
    linkedin?: string
    github?: string
    portfolioUrl?: string
  }
  workExperience: WorkExperience[]
  education: Education[]
  certifications?: Certification[]
  skills: {
    technical: string[]
    tools: string[]
    soft: string[]
    languages: string[]
  }
  atsScore?: {
    overall: number
    formatting: number
    keywordMatch: number
    impactScore: number
    strengths: string[]
    improvements: string[]
  }
}

export interface AgentFinding {
  agentId: AgentId
  agentName: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  title: string
  summary: string
  details: string[]
  score?: number
  metrics?: Record<string, string>
}
