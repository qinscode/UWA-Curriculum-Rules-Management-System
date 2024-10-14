import { RuleType } from '../rules/entities/rule.enum'

export class PDFRuleType {
  static readonly mapping: {
    [RuleType.ASR]: string
    [RuleType.ACECRS]: string
    [RuleType.ENGLISH_ELIGIBILITY]: string
    [RuleType.ADMISSIONS]: string
    [RuleType.RANKING_AND_SELECTION]: string

    [RuleType.ARTICULATION_EXIT_AWARD]: string

    [RuleType.COURSE_STRUCTURE]: string

    [RuleType.SATISFACTORY_PROGRESS]: string

    [RuleType.PROGRESS_STATUS]: string

    [RuleType.AWARD_WITH_DISTINCTION]: string

    [RuleType.DEFERRALS]: string
  } = {
    [RuleType.ASR]: 'Applicability of the Student Rules policies and procedures',
    [RuleType.ACECRS]: 'Academic Conduct Essentials and Communication and Research Skills modules',
    // Admission rules
    [RuleType.ENGLISH_ELIGIBILITY]: 'Admission rules - English language competency requirements',
    [RuleType.ADMISSIONS]: 'Admission rules - admission requirements',
    [RuleType.RANKING_AND_SELECTION]: 'Admission rules - ranking and selection',

    // Articulation and Exit Awards
    [RuleType.ARTICULATION_EXIT_AWARD]: 'Articulation and Exit Awards ',

    // Course structure
    [RuleType.COURSE_STRUCTURE]: 'Course structure',

    // Satisfactory Progress
    [RuleType.SATISFACTORY_PROGRESS]: 'Satisfactory progress rule',

    [RuleType.PROGRESS_STATUS]: 'Progress Status ',
    [RuleType.AWARD_WITH_DISTINCTION]: 'Award with Distinction Rules',
    [RuleType.DEFERRALS]: 'Deferral Rules',
  }

  static getPrintRuleType(ruleType: RuleType): string {
    return this.mapping[ruleType] || 'Other Rules'
  }
}
