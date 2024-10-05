import { UserType } from '../../users/entities/user.enum'

export class UserProfileDto {
  username: string
  email: string
  role: UserType
}
