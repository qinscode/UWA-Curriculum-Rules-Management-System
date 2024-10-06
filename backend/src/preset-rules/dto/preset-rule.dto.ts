import { RuleType } from '../entities/rule.enum'

export class CreatePresetRuleDto {
  name: string
  type: RuleType
  description: string
  presetRequirements?: {
    content: string
    style: string
    is_connector: boolean
    order_index: number
  }[]
}

export class UpdatePresetRuleDto {
  name?: string
  type?: RuleType
  description?: string
  presetRequirements?: {
    content: string
    style: string
    is_connector: boolean
    order_index: number
  }[]
}

export class PresetRequirementHierarchyDto {
  id: number
  content: string
  style: string
  is_connector: boolean
  order_index: number
  children: PresetRequirementHierarchyDto[]
}

export class PresetRuleWithHierarchyDto extends CreatePresetRuleDto {
  id: number
  created_at: Date
  updated_at: Date
  presetRequirements: PresetRequirementHierarchyDto[]
}
