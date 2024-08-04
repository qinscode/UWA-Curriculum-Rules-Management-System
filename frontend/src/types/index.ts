export interface Rule {
  id: number
  code: string
  name: string
  type: string
  description: string
}

export interface Settings {
  courseType: string
  description: string
  id: number
  universityName: string
  academicYear: string
  pdfTemplate: string
  handbookFormat: 'pdf' | 'html' | 'docx'
  defaultUserRole: 'admin' | 'editor' | 'viewer'
  theme: string;
  language: string;
}

export type CreateRuleDTO = Omit<Rule, 'id'>
export type UpdateRuleDTO = Partial<Omit<Rule, 'id'>>
export type UpdateSettingsDTO = Partial<Omit<Settings, 'id'>>
