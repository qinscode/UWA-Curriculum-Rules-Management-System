import React from 'react'

export interface Rule {
  id: number
  code: string
  name: string
  type: string
  description: string
}

export interface RuleHistory extends Rule {
  version: number
  timestamp: string
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
  theme: string
  language: string
}

export interface RuleHistoryDto {
  id: number
  ruleId: number
  code: string
  name: string
  type: string
  description: string
  version: number
  timestamp: string
}

export interface Requirement {
  id: number
  level: number
  content: string
  children: Requirement[]
  style: string
  isConnector?: boolean
}

export interface StyleOption {
  value: string
  label: string
}

export const styleOptions: StyleOption[] = [
  { value: 'numeric', label: '1, 2, 3' },
  { value: 'alphabetic', label: 'a, b, c' },
  { value: 'roman', label: 'i, ii, iii' },
  { value: 'none', label: 'No numbering' },
]

export const numberingStyles = {
  numeric: (index: number, level: number) => (level === 1 ? `${index + 1}` : `(${index + 1})`),
  alphabetic: (index: number, level: number) =>
    level === 1 ? String.fromCharCode(97 + index) : `(${String.fromCharCode(97 + index)})`,
  roman: (index: number, level: number) => {
    const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']
    return level === 1
      ? romanNumerals[index]
      : `(${romanNumerals[index] || (index + 1).toString()})`
  },
  none: () => '',
}

export interface NestedRequirementsListProps {
  initialRequirements?: Requirement[]
  onChange?: (requirements: Requirement[]) => void
  defaultStyles?: string[]
  showControls?: boolean
  showHelpPanel?: boolean
  addMainButtonText?: string
  presetRules?: Requirement[]
}

export interface AdmissionSelectionProps {
  data: {
    englishRequirements?: Requirement[]
    admissionRequirements?: Requirement[]
    rankingSelection?: Requirement[]
    satisfactoryProgress?: Requirement[]
    progressStatus?: Requirement[]
    awardWithDistinction?: Requirement[]
    deferralAllowed?: Requirement[]
    deferralRules?: Requirement[]
  }
  updateData: (data: Partial<AdmissionSelectionProps['data']>) => void
}

export interface RequirementItemProps {
  req: Requirement
  index: number
  parentIndexes: number[]
  defaultStyles: string[]
  onUpdateRequirement: (id: number, content: string) => void
  onRemoveRequirement: (id: number) => void
  onAddRequirement: (parentId: number | null, level: number) => void
  onAddConnector: (parentId: number, level: number) => void
  renderRequirement: (req: Requirement, index: number, parentIndexes: number[]) => React.ReactNode
}

export interface SelectMenuProps {
  value: string
  onChange: (value: string) => void
  options: StyleOption[]
}

export type CreateRuleDTO = Omit<Rule, 'id'>
export type UpdateRuleDTO = Partial<Omit<Rule, 'id'>>
export type UpdateSettingsDTO = Partial<Omit<Settings, 'id'>>
