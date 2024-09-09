import { IsString, IsBoolean, IsOptional } from 'class-validator'

export class CreateCourseDto {
  @IsString()
  code: string

  @IsString()
  name: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  version: string

  @IsBoolean()
  is_current: boolean
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
