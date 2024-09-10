import { RuleType } from '../entities/preset.enum'

export class CreateRuleDto {
  name: string
  type: RuleType
  description: string
  requirements?: {
    content: string
    style: string
    is_connector: boolean
    order_index: number
  }[]
}

export class UpdateRuleDto {
  name?: string
  type?: RuleType
  description?: string
  requirements?: {
    content: string
    style: string
    is_connector: boolean
    order_index: number
  }[]
}

export class RequirementHierarchyDto {
  id: number
  content: string
  style: string
  is_connector: boolean // Changed from isConnector to is_connector
  order_index: number
  children: RequirementHierarchyDto[]
}

export class RuleWithHierarchyDto extends CreateRuleDto {
  id: number
  created_at: Date
  updated_at: Date
  requirements: RequirementHierarchyDto[]
}
