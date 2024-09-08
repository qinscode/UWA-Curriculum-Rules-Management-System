// requirement.dto.ts

export class CreateRequirementDto {
  content: string
  style: string
  is_connector: boolean
  order_index: number
  children?: CreateRequirementDto[]
}

export class UpdateRequirementDto {
  content?: string
  style?: string
  is_connector?: boolean
  order_index?: number
  children?: UpdateRequirementDto[]
}
