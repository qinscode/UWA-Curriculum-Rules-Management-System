import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Course } from './entities/course.entity'
import { CreateCourseDto, UpdateCourseDto } from './dto'

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>
  ) {}

  findAll(): Promise<Course[]> {
    return this.coursesRepository.find()
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({ where: { id } })
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`)
    }
    return course
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.coursesRepository.create(createCourseDto)
    return this.coursesRepository.save(course)
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id)
    Object.assign(course, updateCourseDto)
    return this.coursesRepository.save(course)
  }

  async remove(id: number): Promise<void> {
    const course = await this.findOne(id)
    await this.coursesRepository.remove(course)
  }

  async findVersions(id: number): Promise<Course[]> {
    const course = await this.findOne(id)
    return this.coursesRepository.find({
      where: { code: course.code },
      order: { version: 'DESC' },
    })
  }

  async createVersion(id: number): Promise<Course> {
    const currentCourse = await this.findOne(id)
    const newCourse = this.coursesRepository.create({
      ...currentCourse,
      id: undefined,
      version: currentCourse.version + 1,
      is_current: true,
    })
    await this.coursesRepository.update({ code: currentCourse.code }, { is_current: false })
    return this.coursesRepository.save(newCourse)
  }

  async findFullCourse(id: number): Promise<Course> {
    return this.coursesRepository.findOne({
      where: { id },
      relations: ['rules', 'rules.requirements'],
    })
  }
}
