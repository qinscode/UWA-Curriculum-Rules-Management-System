import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator'
import { UserType } from '../entities/user.enum'

export class CreateUserDto {
  @IsString()
  username: string

  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsOptional()
  @IsEnum(UserType)
  role?: UserType
}
