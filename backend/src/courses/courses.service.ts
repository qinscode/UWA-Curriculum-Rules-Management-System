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

  // 获取所有课程，并动态生成 versions 字段
  async findAll(): Promise<any[]> {
    const courses = await this.coursesRepository.find()

    // 动态生成每个课程的 versions 字段
    const coursesWithVersions = await Promise.all(
      courses.map(async (course) => {
        const relatedCourses = await this.coursesRepository.find({
          where: { code: course.code },
          order: { version: 'DESC' },
        })

        const versions = relatedCourses.map((c) => c.version.toString())

        return {
          ...course,
          versions, // 动态生成的 versions 数组
        }
      })
    )

    return coursesWithVersions
  }

  // 根据 ID 查找单个课程，并动态生成 versions 字段
  async findOne(id: number): Promise<any> {
    const course = await this.coursesRepository.findOne({ where: { id } })

    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`)
    }

    // 查询与当前课程 code 相同的所有版本
    const relatedCourses = await this.coursesRepository.find({
      where: { code: course.code },
      order: { version: 'DESC' },
    })

    // 动态生成 versions 数组
    const versions = relatedCourses.map((c) => c.version.toString())

    // 返回课程信息，并附带生成的 versions 数组
    return {
      ...course,
      versions, // 动态生成的版本数组
    }
  }

  // 创建新课程
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.coursesRepository.create(createCourseDto)
    return this.coursesRepository.save(course)
  }

  // 更新课程信息
  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id)
    Object.assign(course, updateCourseDto)
    return this.coursesRepository.save(course)
  }

  // 删除课程
  async remove(id: number): Promise<void> {
    const course = await this.findOne(id)
    await this.coursesRepository.remove(course)
  }

  async findByCodeAndVersion(code: string, version: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { code, version: +version },
    })

    if (!course) {
      throw new NotFoundException(`Course with code "${code}" and version "${version}" not found`)
    }

    // 只返回匹配的课程信息，不附带 versions
    return course
  }
}
