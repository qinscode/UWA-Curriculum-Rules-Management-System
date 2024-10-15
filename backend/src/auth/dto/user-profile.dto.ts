import { UserType } from '../../users/entities/user.enum'

export class UserProfileDto {
  id: number
  username: string
  email: string
  role: UserType
  createdAt: string
}
