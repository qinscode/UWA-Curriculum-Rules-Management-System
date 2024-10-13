import { IsString, IsBoolean, IsOptional } from 'class-validator'

export class CreatePresetCourseDto {
  @IsString()
  code: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  version: string
}

export class UpdatePresetCourseDto {
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
