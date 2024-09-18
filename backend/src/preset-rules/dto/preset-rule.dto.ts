import { PresetRuleType } from '../entities/preset-rule.enum'

export class CreatePresetRuleDto {
  name: string
  type: PresetRuleType
  description: string
  Requirements?: {
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
  Requirements?: {
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
  Requirements: PresetRequirementHierarchyDto[]
}
