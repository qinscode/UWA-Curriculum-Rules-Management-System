import { NumberingStyle } from '../entities/style.enum'

export class CreatePresetRequirementDto {
  content: string
  style: NumberingStyle
  is_connector: boolean
  order_index: number
  children?: CreatePresetRequirementDto[]
}

export class UpdatePresetRequirementDto {
  id?: number
  content?: string
  style?: NumberingStyle
  is_connector?: boolean
  order_index?: number
  children?: UpdatePresetRequirementDto[]
}

export class PresetRequirementDto {
  id: number
  content: string
  style: NumberingStyle
  is_connector: boolean
  order_index: number
  children: PresetRequirementDto[]
}
