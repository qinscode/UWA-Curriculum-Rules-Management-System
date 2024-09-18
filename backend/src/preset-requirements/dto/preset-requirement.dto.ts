export class CreatePresetRequirementDto {
  content: string
  style: string
  isConnector: boolean
  order_index: number
  children?: CreatePresetRequirementDto[]
}

export class UpdatePresetRequirementDto {
  id?: number
  content?: string
  style?: string
  isConnector?: boolean
  order_index?: number
  children?: UpdatePresetRequirementDto[]
}
