import React from 'react'
import { UniqueIdentifier } from '@dnd-kit/core'

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

export interface RequirementTreeNodeProps {
  req: Requirement
  index: number
  parentIndexes: number[]
  defaultStyles: string[]
  onUpdateRequirement: (id: number, content: string) => void
  onRemoveRequirement: (id: number) => void
  onAddRequirement: (parentId: number | null, level: number) => void
  onAddConnector: (parentId: number, level: number) => void
  renderRequirementNode: (
    req: Requirement,
    index: number,
    parentIndexes: number[]
  ) => React.ReactNode
}
export interface SelectMenuProps {
  value: string
  onChange: (value: string) => void
  options: StyleOption[]
}

export type CreateRuleDTO = Omit<Rule, 'id'>
export type UpdateRuleDTO = Partial<Omit<Rule, 'id'>>
export type UpdateSettingsDTO = Partial<Omit<Settings, 'id'>>

export interface TreeItemAdapterExtra {
  id: UniqueIdentifier
  children: TreeItemAdapter[]
  collapsed?: boolean
  canHaveChildren?: boolean
  disableSorting?: boolean
}
export enum NumberingStyle {
  Numeric = 'numeric',
  Alphabetic = 'alphabetic',
  Roman = 'roman',
  None = 'none',
}

export interface Requirement {
  id: number
  content: string
  style: NumberingStyle
  numbering?: string
  children: Requirement[]
  isConnector?: boolean
}

export interface TreeItemAdapterExtra {
  id: UniqueIdentifier
  children: TreeItemAdapter[]
  collapsed?: boolean
  canHaveChildren?: boolean
  disableSorting?: boolean
}

export type TreeItemAdapter = Omit<Requirement, 'id' | 'children'> & TreeItemAdapterExtra
