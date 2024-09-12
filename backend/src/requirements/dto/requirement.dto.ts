export class CreateRequirementDto {
  content: string
  style: string
  isConnector: boolean
  order_index: number
  children?: CreateRequirementDto[]
}

export class UpdateRequirementDto {
  id?: number
  content?: string
  style?: string
  isConnector?: boolean
  order_index?: number
  children?: UpdateRequirementDto[]
}
