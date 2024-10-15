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
  CreateAdminDto,
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

  private mapUserToProfileDto(user: User): UserProfileDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt:
        user.created_at instanceof Date
          ? user.created_at.toISOString()
          : new Date(user.created_at).toISOString(),
    }
  }

  async getProfile(userId: number): Promise<UserProfileDto> {
    const user = await this.usersService.findOne(userId)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return this.mapUserToProfileDto(user)
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

  async createAdmin(createAdminDto: CreateAdminDto) {
    const existingUser = await this.usersService.findByEmail(createAdminDto.email)
    if (existingUser) {
      throw new ConflictException('User already exists')
    }
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10)
    const user = await this.usersService.create({
      ...createAdminDto,
      password: hashedPassword,
      role: UserType.ADMIN,
    } as User) // 使用 User 类型来包含 role 属性
    return { message: 'Admin user created successfully', userId: user.id }
  }

  async getAllUsers(): Promise<UserProfileDto[]> {
    const users = await this.usersService.findAll()
    return users.map((user) => this.mapUserToProfileDto(user))
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersService.remove(id)
  }
}
