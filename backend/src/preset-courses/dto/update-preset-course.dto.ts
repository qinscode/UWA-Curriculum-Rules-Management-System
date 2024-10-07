import { PartialType } from '@nestjs/mapped-types'
import { CreatePresetCourseDto } from './create-preset-course.dto'

export class UpdatePresetCourseDto extends PartialType(CreatePresetCourseDto) {}
