import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  Put,
  ForbiddenException,
  Delete,
  Param,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './jwt-auth.guard'

import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UserProfileDto,
  CreateAdminDto,
} from './dto'
import { UpdateUserProfileDto } from '../users/dto/update-user-profile.dto'
import { UserType } from '../users/entities/user.enum'
import { UsersService } from '../users/users.service'

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto)
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Request() req): Promise<UserProfileDto> {
    return this.authService.getProfile(req.user.userId)
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateUserProfileDto
  ): Promise<UserProfileDto> {
    return this.authService.updateProfile(req.user.userId, updateProfileDto)
  }

  @UseGuards(JwtAuthGuard)
  @Put('password')
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, changePasswordDto)
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto)
  }

  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto)
  }

  @Post('create-admin')
  @UseGuards(JwtAuthGuard)
  async createAdmin(@Request() req, @Body() createAdminDto: CreateAdminDto) {
    const user = await this.usersService.findOne(req.user.userId)
    if (user.role !== UserType.ADMIN) {
      throw new ForbiddenException('Only administrators can create new admin users')
    }
    return this.authService.createAdmin(createAdminDto)
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(@Request() req): Promise<UserProfileDto[]> {
    const user = await this.usersService.findOne(req.user.userId)
    if (user.role !== UserType.ADMIN) {
      throw new ForbiddenException('Only administrators can view all users')
    }
    return this.authService.getAllUsers()
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard)
  async deleteUser(@Request() req, @Param('id') id: string) {
    const user = await this.usersService.findOne(req.user.userId)
    if (user.role !== UserType.ADMIN) {
      throw new ForbiddenException('Only administrators can delete users')
    }
    return this.authService.deleteUser(+id)
  }
}
