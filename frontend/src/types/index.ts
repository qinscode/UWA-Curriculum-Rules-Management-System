export enum NumberingStyle {
  Numeric = 'numeric',
  Alphabetic = 'alphabetic',
  Roman = 'roman',
  None = 'none',
}

export enum CourseType {
  GraduateCertificate = 'Graduate Certificate',
  GraduateDiploma = 'Graduate Diploma',
  MastersCoursework = "Master's (Coursework)",
  MastersExtended = "Master's Extended",
  MastersResearch = "Master's Research",
  DoctoralDegree = 'Doctoral Degree',
  ProfessionalDoctorateMastersCoursework = "Professional Doctorate/Master's Coursework",
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
  ARTICULATION_EXIT_AWARD = 'Articulation Exit Award',
  COURSE_STRUCTURE = 'Course Structure',
}

export interface Course {
  id: number
  code: string
  name: string
  type: string
  versions: string[]
  version: string
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

export interface CreateCourseDto {
  code: string
  name?: string
  type: string
  version: string
}

export interface Requirement {
  id: number
  content: string
  style: NumberingStyle
  children: Requirement[]
  is_connector?: boolean // use is_connector not isConnector
}

export interface StyleOption {
  value: NumberingStyle
  label: string
}

// Props interfaces
export interface NestedRequirementsListProps {
  initialRequirements?: Requirement[]
  onUpdate: (
    requirements: Requirement[] | ((prevRequirements: Requirement[]) => Requirement[])
  ) => void
  defaultStyles?: NumberingStyle[]
  showControls?: boolean
  showHelpPanel?: boolean
  addMainButtonText?: string
  presetRules?: Requirement[]
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
    articulationExitAward?: Requirement[]
    courseStructure?: Requirement[]
  }
  updateData: (data: Partial<GeneralProps['data']>) => void
  initialPresetRules: any[]
}

export enum UserRole {
  ADMIN = 'admin',
  NORMAL = 'normal',
}

export interface User {
  id: number
  username: string
  email: string
  role: UserRole
}
