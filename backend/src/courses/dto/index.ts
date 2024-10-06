import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsEnum } from 'class-validator'
import { CourseType } from '../entities/course-type.enum'

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  code: string

  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEnum(CourseType)
  type: CourseType

  @IsNotEmpty()
  @IsString()
  version: string
}

export class UpdateCourseDto {
  @IsString()
  @IsOptional()
  code?: string

  @IsString()
  @IsOptional()
  name?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  version?: string

  @IsBoolean()
  @IsOptional()
  is_current?: boolean
}
