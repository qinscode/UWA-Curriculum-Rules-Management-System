import { PresetRuleType } from '../entities/preset-rule.enum'
import { CourseType } from '../../courses/entities/course-type.enum'

export class CreatePresetRuleDto {
  name: string
  type: PresetRuleType
  description: string
  course_type: CourseType
}

export class UpdatePresetRuleDto {
  name?: string
  type?: PresetRuleType
  description?: string
  course_type?: CourseType
}

export class PresetRuleWithHierarchyDto {
  id: number
  name: string
  type: PresetRuleType
  description: string
  course_type: CourseType
  Requirements: PresetRequirementHierarchyDto[]
}

export class PresetRequirementHierarchyDto {
  id: number
  content: string
  style: string
  is_connector: boolean
  children: PresetRequirementHierarchyDto[]
}
