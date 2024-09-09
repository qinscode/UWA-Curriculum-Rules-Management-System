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
  SKILLS = 'Skills',
  KNOWLEDGE_APPLICATION = 'Knowledge Application',
  KNOWLEDGE = 'Knowledge',
  RANKING_AND_SELECTION = 'Ranking and selection for admission',
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
  onUpdate: (requirements: Requirement[]) => void
  defaultStyles?: NumberingStyle[]
  showControls?: boolean
  showHelpPanel?: boolean
  addMainButtonText?: string
  presetRules?: Requirement[]
}

export interface ManageRulesProps {
  data: {
    englishRequirements?: Requirement[]
    admissionRequirements?: Requirement[]
    rankingSelection?: Requirement[]
    satisfactoryProgress?: Requirement[]
    progressStatus?: Requirement[]
    awardWithDistinction?: Requirement[]
    deferralAllowed?: false
    deferralRules?: Requirement[]
    additionalRules?: Requirement[]
    deferrals?: Requirement[]
    aqfOutcomes?: Requirement[]
    knowledgeApplication?: Requirement[]
    skills?: Requirement[]
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

export interface GeneralProps {
  data: {
    knowledge: Requirement[]
    englishRequirements?: Requirement[]
    admissionRequirements?: Requirement[]
    rankingSelection?: Requirement[]
    satisfactoryProgress?: Requirement[]
    progressStatus?: Requirement[]
    awardWithDistinction?: Requirement[]
    deferralAllowed?: boolean
    additionalRules?: Requirement[]
    deferrals?: Requirement[]
    aqfOutcomes?: Requirement[]
    knowledgeApplication?: Requirement[]
    skills?: Requirement[]
  }
  updateData: (data: Partial<GeneralProps['data']>) => void
}
