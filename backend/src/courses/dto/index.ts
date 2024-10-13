import { IsString, IsBoolean, IsOptional, IsNotEmpty, IsEnum } from 'class-validator'
import { CourseType } from '../entities/course-type.enum'
import { RuleType } from '../../rules/entities/rule.enum'
import { NumberingStyle } from '../../requirements/entities/style.enum'

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

export class CreateRuleDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsEnum(RuleType)
  type: RuleType

  @IsNotEmpty()
  @IsString()
  description: string

  @IsOptional()
  requirements?: CreateRequirementDto[]
}

export class UpdateRuleDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsEnum(RuleType)
  type?: RuleType

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  requirements?: CreateRequirementDto[]
}

export class CreateRequirementDto {
  @IsNotEmpty()
  @IsString()
  content: string

  @IsNotEmpty()
  @IsEnum(NumberingStyle)
  style: NumberingStyle

  @IsOptional()
  @IsBoolean()
  is_connector?: boolean

  @IsOptional()
  parentId?: number
}
