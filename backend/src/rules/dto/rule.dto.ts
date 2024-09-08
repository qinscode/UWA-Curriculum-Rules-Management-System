import { RuleType } from '../entities/rule.enum'

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
