import { SetMetadata } from '@nestjs/common'
import { UserType } from '../../users/entities/user.enum'

export const ROLES_KEY = 'role'
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles)
