import { IsString, IsNotEmpty, IsEnum } from 'class-validator'
import { PresetCourseType } from '../entities/preset-course-type.enum'

export class CreatePresetCourseDto {
  @IsString()
  @IsNotEmpty()
  code: string

  @IsString()
  @IsNotEmpty()
  name: string

  @IsEnum(PresetCourseType)
  type: PresetCourseType

  @IsString()
  @IsNotEmpty()
  version: string
}