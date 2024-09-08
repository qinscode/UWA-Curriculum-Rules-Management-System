import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import { User } from './entities/user.entity'

describe('AuthController', () => {
  let controller: AuthController
  let authService: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            getProfile: jest.fn(),
            updateProfile: jest.fn(),
            changePassword: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    authService = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = { username: 'test', email: 'test@test.com', password: 'password' }
      const expectedResult = { message: 'User registered successfully' }
      jest.spyOn(authService, 'register').mockResolvedValue(expectedResult)

      expect(await controller.register(registerDto)).toEqual(expectedResult)
      expect(authService.register).toHaveBeenCalledWith(registerDto)
    })
  })

  describe('login', () => {
    it('should return a JWT token on successful login', async () => {
      const loginDto = { email: 'test@test.com', password: 'password' }
      const expectedResult = { access_token: 'jwt_token' }
      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult)

      expect(await controller.login(loginDto)).toEqual(expectedResult)
      expect(authService.login).toHaveBeenCalledWith(loginDto)
    })

    it('should throw UnauthorizedException on invalid credentials', async () => {
      const loginDto = { email: 'test@test.com', password: 'wrong_password' }
      jest
        .spyOn(authService, 'login')
        .mockRejectedValue(new UnauthorizedException('Invalid credentials'))

      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const user: Partial<User> = {
        id: 1,
        username: 'test',
        email: 'test@test.com',
        password: 'hashedpassword',
        created_at: new Date(),
        updated_at: new Date(),
      }
      const req = { user: { id: 1 } }
      jest.spyOn(authService, 'getProfile').mockResolvedValue(user as User)

      expect(await controller.getProfile(req)).toEqual(user)
      expect(authService.getProfile).toHaveBeenCalledWith(1)
    })
  })
})
