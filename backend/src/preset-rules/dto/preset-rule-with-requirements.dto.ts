import { PresetRuleType } from '../entities/preset-rule.enum'
import { CourseType } from '../../courses/entities/course-type.enum'
import { PresetRequirementDto } from '../../preset-requirements/dto/preset-requirement.dto'

export class PresetRuleWithRequirementsDto {
  id: number
  name: string
  type: PresetRuleType
  description: string
  course_type: CourseType
  requirements: PresetRequirementDto[]
}
