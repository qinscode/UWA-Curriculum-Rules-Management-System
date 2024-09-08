export class CreateRequirementDto {
  content: string
  style: string
  parent_id?: number
  is_connector: boolean
  order_index: number
}

export class CreateRuleDto {
  code: string
  name: string
  type: string
  description: string
  requirements?: CreateRequirementDto[]
}

export class UpdateRequirementDto {
  content?: string
  style?: string
  parent_id?: number
  is_connector?: boolean
  order_index?: number
}

export class UpdateRuleDto {
  code?: string
  name?: string
  type?: string
  description?: string
  requirements?: UpdateRequirementDto[]
}
