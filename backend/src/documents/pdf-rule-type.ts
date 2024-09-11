import { RuleType } from '../rules/entities/rule.enum'

export class PDFRuleType {
    static readonly mapping: { [key in RuleType]: string } = {
        // Admission rules
        [RuleType.ENGLISH_ELIGIBILITY]: 'Admission rules - English language competency requirements',
        [RuleType.ADMISSIONS]: 'Admission rules - admission requirements',
        [RuleType.RANKING_AND_SELECTION]: 'Admission rules - ranking and selection',

        // Articulation and Exit Awards
        [RuleType.ARTICULATION_AND_EXIT_AWARDS]: 'Articulation and Exit Awards ',

        // Course structure
        [RuleType.COURSE_STRUCTURE]: 'Course structure',

        // Satisfactory Progress
        [RuleType.SATISFACTORY_PROGRESS]: 'Satisfactory progress rule',

        [RuleType.PROGRESS_STATUS]: 'Progress Status ',
        [RuleType.AWARD_WITH_DISTINCTION]: 'Award with Distinction Rules',
        [RuleType.DEFERRALS]: 'Deferral Rules',
        [RuleType.ADDITIONAL_RULES]: 'Additional Rules',
        [RuleType.SKILLS]: 'Skills Rules',
        [RuleType.KNOWLEDGE_APPLICATION]: 'Knowledge Application Rules',
        [RuleType.KNOWLEDGE]: 'Knowledge Rules',
    }

    static getPrintRuleType(ruleType: RuleType): string {
        return this.mapping[ruleType] || 'Other Rules'
    }
}