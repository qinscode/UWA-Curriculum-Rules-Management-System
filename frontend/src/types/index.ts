import React from 'react'

// Enums
export enum NumberingStyle {
  Numeric = 'numeric',
  Alphabetic = 'alphabetic',
  Roman = 'roman',
  None = 'none',
}

export enum RuleType {
  ENGLISH_ELIGIBILITY = 'English Eligibility',
  ADMISSIONS = 'Admissions',
  SATISFACTORY_PROGRESS = 'Satisfactory Progress',
  PROGRESS_STATUS = 'Progress Status',
  AWARD_WITH_DISTINCTION = 'Award with Distinction',
  DEFERRALS = 'Deferrals',
  ADDITIONAL_RULES = 'Additional Rules',
  AQF_OUTCOMES = 'AQF Outcomes',
  SKILLS = 'Skills',
  KNOWLEDGE_APPLICATION = 'Knowledge Application',
}

// Interfaces
export interface Course {
  id: number
  code: string
  name: string
  type: string
  versions: string[]
  version: string
  category: string
  lastUpdated: string
  rules: Rule[]
}

export interface Rule {
  id: number
  name: string
  code: string
  type: RuleType
  description: string
  requirements: Requirement[]
}

export interface Requirement {
  id: number
  content: string
  style: NumberingStyle
  numbering?: string
  children: Requirement[]
  isConnector?: boolean
}

export interface StyleOption {
  value: NumberingStyle
  label: string
}

// Props interfaces
export interface NestedRequirementsListProps {
  initialRequirements?: Requirement[]
  onChange?: (requirements: Requirement[]) => void
  defaultStyles?: NumberingStyle[]
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
    deferralAllowed?: false
    deferralRules?: Requirement[]
  }
  updateData: (data: { deferralRules: Requirement[] }) => void
}

export interface RequirementTreeNodeProps {
  req: Requirement
  index: number
  parentIndexes: number[]
  defaultStyles: NumberingStyle[]
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
  value: NumberingStyle
  onChange: (value: NumberingStyle) => void
  options: StyleOption[]
}

// DTOs
export interface CreateRuleDTO {
  name: string
  code: string
  type: RuleType
  description: string
  requirements: Requirement[]
}

export interface UpdateRuleDTO {
  name?: string
  type?: RuleType
  description?: string
  requirements?: Requirement[]
}

// Constants
export const styleOptions: StyleOption[] = [
  { value: NumberingStyle.Numeric, label: '1, 2, 3' },
  { value: NumberingStyle.Alphabetic, label: 'a, b, c' },
  { value: NumberingStyle.Roman, label: 'i, ii, iii' },
  { value: NumberingStyle.None, label: 'No numbering' },
]

// Utility functions
export const numberingStyles = {
  [NumberingStyle.Numeric]: (index: number, level: number) =>
    level === 1 ? `${index + 1}` : `(${index + 1})`,
  [NumberingStyle.Alphabetic]: (index: number, level: number) =>
    level === 1 ? String.fromCharCode(97 + index) : `(${String.fromCharCode(97 + index)})`,
  [NumberingStyle.Roman]: (index: number, level: number) => {
    const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']
    return level === 1
      ? romanNumerals[index]
      : `(${romanNumerals[index] || (index + 1).toString()})`
  },
  [NumberingStyle.None]: () => '',
}
