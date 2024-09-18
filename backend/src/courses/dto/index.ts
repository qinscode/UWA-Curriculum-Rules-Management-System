export class CreateCourseDto {
  code: string
  name: string
  description: string
  version: number
  is_current: boolean
}

export class UpdateCourseDto {
  code?: string
  name?: string
  description?: string
  version?: number
  is_current?: boolean
}
