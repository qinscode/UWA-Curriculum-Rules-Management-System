import { Requirement, Rule, RuleType } from '@/types'

export interface BackendRule {
  id: number
  name: string
  type: string
  description: string
  Requirements: {
    id: number
    content: string
    style: string
    is_connector: boolean
    children: any[]
  }[]
}

export interface CategorizedPresetRules {
  knowledge: Requirement[]
  englishRequirements: Requirement[]
  admissionRequirements: Requirement[]
  rankingSelection: Requirement[]
  satisfactoryProgress: Requirement[]
  progressStatus: Requirement[]
  awardWithDistinction: Requirement[]
  additionalRules: Requirement[]
  deferrals: Requirement[]
  skills: Requirement[]
  knowledgeApplication: Requirement[]
  articulationExitAward?: Requirement[]
  courseStructure?: Requirement[]
}

function categorizeRules(rules: Rule[]): CategorizedPresetRules {
  const categorizedRules: CategorizedPresetRules = {
    knowledge: [],
    englishRequirements: [],
    admissionRequirements: [],
    rankingSelection: [],
    satisfactoryProgress: [],
    progressStatus: [],
    awardWithDistinction: [],
    additionalRules: [],
    deferrals: [],
    skills: [],
    knowledgeApplication: [],
  }

  rules.forEach((rule) => {
    switch (rule.type) {
      case RuleType.KNOWLEDGE:
        categorizedRules.knowledge = rule.requirements
        break
      case RuleType.ENGLISH_ELIGIBILITY:
        categorizedRules.englishRequirements = rule.requirements
        break
      case RuleType.ADMISSIONS:
        categorizedRules.admissionRequirements = rule.requirements
        break
      case RuleType.RANKING_AND_SELECTION:
        categorizedRules.rankingSelection = rule.requirements
        break
      case RuleType.SATISFACTORY_PROGRESS:
        categorizedRules.satisfactoryProgress = rule.requirements
        break
      case RuleType.PROGRESS_STATUS:
        categorizedRules.progressStatus = rule.requirements
        break
      case RuleType.AWARD_WITH_DISTINCTION:
        categorizedRules.awardWithDistinction = rule.requirements
        break
      case RuleType.ADDITIONAL_RULES:
        categorizedRules.additionalRules = rule.requirements
        break
      case RuleType.DEFERRALS:
        categorizedRules.deferrals = rule.requirements
        break
      case RuleType.SKILLS:
        categorizedRules.skills = rule.requirements
        break
      case RuleType.KNOWLEDGE_APPLICATION:
        categorizedRules.knowledgeApplication = rule.requirements
        break
      case RuleType.ARTICULATION_EXIT_AWARD:
        categorizedRules.articulationExitAward = rule.requirements
        break
      case RuleType.COURSE_STRUCTURE:
        categorizedRules.courseStructure = rule.requirements
        break
    }
  })

  return categorizedRules
}

export default categorizeRules
