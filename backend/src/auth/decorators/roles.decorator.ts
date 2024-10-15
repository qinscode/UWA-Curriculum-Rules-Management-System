import { SetMetadata } from '@nestjs/common'
import { UserType } from '../../users/entities/user.enum'

export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles)
