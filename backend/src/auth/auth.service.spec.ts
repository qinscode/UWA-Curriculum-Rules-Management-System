import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Repository } from 'typeorm'
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

describe('AuthService', () => {
  let authService: AuthService
  let userRepository: Repository<User>
  let jwtService: JwtService

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  }

  const mockJwtService = {
    sign: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile()

    authService = module.get<AuthService>(AuthService)
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }
      const hashedPassword = 'hashedPassword'

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never)
      mockUserRepository.create.mockReturnValue({ ...registerDto, password: hashedPassword })
      mockUserRepository.save.mockResolvedValue({ id: 1, ...registerDto, password: hashedPassword })

      const result = await authService.register(registerDto)

      expect(result).toEqual({ message: 'User registered successfully' })
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...registerDto,
        password: hashedPassword,
      })
      expect(mockUserRepository.save).toHaveBeenCalled()
    })

    it('should throw ConflictException if user already exists', async () => {
      const registerDto = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'password123',
      }

      mockUserRepository.findOne.mockResolvedValue({ id: 1, ...registerDto })

      await expect(authService.register(registerDto)).rejects.toThrow(ConflictException)
    })
  })

  describe('login', () => {
    it('should return a JWT token for valid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'password123' }
      const user = {
        id: 1,
        username: 'testuser',
        email: loginDto.email,
        password: 'hashedPassword',
      }
      const token = 'jwt_token'

      mockUserRepository.findOne.mockResolvedValue(user)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never)
      mockJwtService.sign.mockReturnValue(token)

      const result = await authService.login(loginDto)

      expect(result).toEqual({ access_token: token })
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: loginDto.email } })
      expect(mockJwtService.sign).toHaveBeenCalledWith({ username: user.username, sub: user.id })
    })

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto = { email: 'test@example.com', password: 'wrongpassword' }

      mockUserRepository.findOne.mockResolvedValue(null)

      await expect(authService.login(loginDto)).rejects.toThrow(UnauthorizedException)
    })
  })

  describe('getProfile', () => {
    it('should return user profile without password', async () => {
      const userId = 1
      const user = {
        id: userId,
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
      }

      mockUserRepository.findOne.mockResolvedValue(user)

      const result = await authService.getProfile(userId)

      expect(result).toEqual({ id: userId, username: 'testuser', email: 'test@example.com' })
      expect(result).not.toHaveProperty('password')
    })

    it('should throw NotFoundException if user not found', async () => {
      const userId = 999

      mockUserRepository.findOne.mockResolvedValue(null)

      await expect(authService.getProfile(userId)).rejects.toThrow(NotFoundException)
    })
  })
})
