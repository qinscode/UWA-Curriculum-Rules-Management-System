export class CreateRequirementDto {
  content: string
  style: string
  is_connector: boolean
  order_index: number
  children?: CreateRequirementDto[]
}

export class UpdateRequirementDto {
  id?: number
  content?: string
  style?: string
  is_connector?: boolean
  order_index?: number
  children?: UpdateRequirementDto[]
}
