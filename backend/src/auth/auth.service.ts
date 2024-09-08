import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10)
    const user = this.usersRepository.create({
      ...registerDto,
      password: hashedPassword,
    })
    await this.usersRepository.save(user)
    return { message: 'User registered successfully' }
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({ where: { email: loginDto.email } })
    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const payload = { username: user.username, sub: user.id }
      return {
        access_token: this.jwtService.sign(payload),
      }
    }
    throw new UnauthorizedException('Invalid credentials')
  }

  async getProfile(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    delete user.password
    return user
  }

  async updateProfile(userId: number, updateProfileDto: any) {
    await this.usersRepository.update(userId, updateProfileDto)
    return this.getProfile(userId)
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect')
    }
    user.password = await bcrypt.hash(changePasswordDto.newPassword, 10)
    await this.usersRepository.save(user)
    return { message: 'Password changed successfully' }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersRepository.findOne({ where: { email: forgotPasswordDto.email } })
    if (!user) {
      throw new NotFoundException('User not found')
    }
    // Generate and send reset token (implement email sending logic here)
    return { message: 'Password reset instructions sent to your email' }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Verify reset token and update password
    // Implement the logic to verify the reset token and update the password
    return { message: 'Password reset successfully' }
  }
}
