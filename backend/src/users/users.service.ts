import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserProfileDto } from './dto/update-user-profile.dto'
import { User } from './entities/user.entity'
import { UserType } from './entities/user.enum'
import { UpdateUserDto } from './dto/update-user.dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto & { role?: UserType }): Promise<User> {
    const user = this.usersRepository.create({
      ...createUserDto,
      role: createUserDto.role || UserType.NORMAL, // 如果没有提供角色，默认为普通用户
    })
    return await this.usersRepository.save(user)
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find()
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } })
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id)
    Object.assign(user, updateUserDto)
    return await this.usersRepository.save(user)
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id)
    await this.usersRepository.remove(user)
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { email } })
  }

  async updateProfile(id: number, updateUserProfileDto: UpdateUserProfileDto): Promise<User> {
    const user = await this.findOne(id)
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`)
    }
    // 只更新允许的字段
    user.username = updateUserProfileDto.username
    user.email = updateUserProfileDto.email
    return await this.usersRepository.save(user)
  }
}
