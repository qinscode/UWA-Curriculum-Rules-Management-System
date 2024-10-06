import { PresetRuleType } from '../entities/preset-rule.enum'

export class CreatePresetRuleDto {
  name: string
  type: PresetRuleType
  description: string
  requirements?: {
    content: string
    style: string
    is_connector: boolean
    order_index: number
  }[]
}

export class UpdatePresetRuleDto {
  name?: string
  type?: PresetRuleType
  description?: string
  requirements?: {
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
  is_connector: boolean // Changed from is_connector to is_connector
  order_index: number
  children: PresetRequirementHierarchyDto[]
}

export class RuleWithHierarchyDto extends PresetCreateRuleDto {
  id: number
  created_at: Date
  updated_at: Date
  requirements: PresetRequirementHierarchyDto[]
}
