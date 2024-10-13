import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class UpdateUserProfileDto {
  @IsNotEmpty()
  @IsString()
  username: string

  @IsNotEmpty()
  @IsEmail()
  email: string
}
