import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { Course } from './entities/course.entity'
import { CreateCourseDto, UpdateCourseDto } from './dto'
import { RuleType } from '../rules/entities/rule.enum'
import { Rule } from '../rules/entities/rule.entity'
import { CreateRuleDto, UpdateRuleDto } from '../rules/dto/rule.dto'
import { NumberingStyle } from '../requirements/entities/style.enum'

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Rule)
    private rulesRepository: Repository<Rule>
  ) {}

  async findAll(): Promise<any[]> {
    const allCourses = await this.coursesRepository.find({
      order: { code: 'ASC', version: 'DESC' },
    })

    const latestVersions = new Map<string, Course>()

    allCourses.forEach((course) => {
      if (!latestVersions.has(course.code)) {
        latestVersions.set(course.code, course)
      }
    })

    return await Promise.all(
      Array.from(latestVersions.values()).map(async (course) => {
        const versions = await this.coursesRepository
          .createQueryBuilder('course')
          .select('course.version', 'version')
          .where('course.code = :code', { code: course.code })
          .orderBy('course.version', 'DESC')
          .getRawMany()

        return {
          ...course,
          versions: versions.map((v) => v.version.toString()),
        }
      })
    )
  }

  async findOne(id: number): Promise<any> {
    const course = await this.coursesRepository.findOne({ where: { id } })

    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`)
    }

    const relatedCourses = await this.coursesRepository.find({
      where: { code: course.code },
      order: { version: 'DESC' },
    })

    const versions = relatedCourses.map((c) => c.version.toString())

    return {
      ...course,
      versions,
    }
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const course = this.coursesRepository.create(createCourseDto)
    const savedCourse = await this.coursesRepository.save(course)

    const ruleTypes = Object.values(RuleType)
    const rules = ruleTypes.map((ruleType) => ({
      name: ruleType,
      type: ruleType,
      description: `Default description for ${ruleType}`,
      course: savedCourse,
    }))

    await this.rulesRepository.save(rules)

    return this.coursesRepository.findOne({
      where: { id: savedCourse.id },
      relations: ['rules'],
    })
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id)
    Object.assign(course, updateCourseDto)
    return this.coursesRepository.save(course)
  }

  async remove(id: number): Promise<void> {
    const course = await this.coursesRepository.findOne({ where: { id } })
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`)
    }
    await this.coursesRepository.remove(course)
  }
  async findByCodeAndVersion(code: string, version: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { code, version: version.toString() },
    })

    if (!course) {
      throw new NotFoundException(`Course with code "${code}" and version "${version}" not found`)
    }

    return course
  }

  async findAllRules(courseId: number): Promise<Rule[]> {
    const course = await this.findOne(courseId)
    return this.rulesRepository.find({ where: { course: { id: course.id } } })
  }

  async findOneRule(courseId: number, ruleId: number): Promise<Rule> {
    const course = await this.findOne(courseId)
    return this.rulesRepository.findOne({ where: { id: ruleId, course: { id: course.id } } })
  }

  async findRuleByType(courseId: number, type: RuleType): Promise<Rule> {
    const course = await this.findOne(courseId)
    return this.rulesRepository.findOne({ where: { type, course: { id: course.id } } })
  }

  async createRule(courseId: number, createRuleDto: CreateRuleDto): Promise<Rule> {
    const course = await this.findOne(courseId)
    const rule = this.rulesRepository.create({
      ...createRuleDto,
      course,
      requirements: createRuleDto.requirements?.map((req) => ({
        ...req,
        style: req.style as NumberingStyle,
      })),
    } as DeepPartial<Rule>)
    return this.rulesRepository.save(rule as Rule)
  }

  async updateRule(courseId: number, ruleId: number, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    const rule = await this.findOneRule(courseId, ruleId)
    if (!rule) {
      throw new NotFoundException(`Rule with ID "${ruleId}" not found in course "${courseId}"`)
    }
    Object.assign(rule, updateRuleDto)
    return this.rulesRepository.save(rule)
  }

  async updateRuleByType(
    courseId: number,
    type: RuleType,
    updateRuleDto: UpdateRuleDto
  ): Promise<Rule> {
    const rule = await this.findRuleByType(courseId, type)
    if (!rule) {
      throw new NotFoundException(`Rule with type "${type}" not found in course "${courseId}"`)
    }
    Object.assign(rule, updateRuleDto)
    return this.rulesRepository.save(rule)
  }

  async removeRule(courseId: number, ruleId: number): Promise<void> {
    const rule = await this.findOneRule(courseId, ruleId)
    if (!rule) {
      throw new NotFoundException(`Rule with ID "${ruleId}" not found in course "${courseId}"`)
    }
    await this.rulesRepository.remove(rule)
  }

  async removeRuleByType(courseId: number, type: RuleType): Promise<void> {
    const rule = await this.findRuleByType(courseId, type)
    if (!rule) {
      throw new NotFoundException(`Rule with type "${type}" not found in course "${courseId}"`)
    }
    await this.rulesRepository.remove(rule)
  }
}
