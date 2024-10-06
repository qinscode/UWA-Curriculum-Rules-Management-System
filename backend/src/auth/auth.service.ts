import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UserProfileDto,
} from './dto'
import { UsersService } from '../users/users.service'
import { User } from '../users/entities/user.entity'
import { UpdateUserProfileDto } from '../users/dto/update-user-profile.dto'
import { UserType } from '../users/entities/user.enum'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email)
    if (existingUser) {
      throw new ConflictException('User already exists')
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10)
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    })
    return { message: 'User registered successfully', userId: user.id }
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email)
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const payload = { username: user.username, sub: user.id }
      return {
        access_token: this.jwtService.sign(payload),
      }
    }
    throw new UnauthorizedException('Invalid credentials')
  }

  async getProfile(userId: number): Promise<UserProfileDto> {
    const user = await this.usersService.findOne(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return this.mapUserToProfileDto(user)
  }

  private mapUserToProfileDto(user: User): {
    role: UserType
    id: number
    email: string
    username: string
  } {
    const { id, username, email, role } = user
    return { id, username, email, role }
  }

  async updateProfile(
    userId: number,
    updateProfileDto: UpdateUserProfileDto
  ): Promise<UserProfileDto> {
    const updatedUser = await this.usersService.updateProfile(userId, updateProfileDto)
    return this.mapUserToProfileDto(updatedUser)
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersService.findOne(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect')
    }
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10)
    await this.usersService.update(userId, { password: hashedPassword })
    return { message: 'Password changed successfully' }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return { message: 'Password reset instructions sent to your email' }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const userId = 1 // This should be extracted from the verified token
    const user = await this.usersService.findOne(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10)
    await this.usersService.update(userId, { password: hashedPassword })
    return { message: 'Password reset successfully' }
  }
}
