import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Course } from './entities/course.entity'
import { Rule } from '../rules/entities/rule.entity'
import { CreateCourseDto, UpdateCourseDto } from './dto/'
import { CreateRuleDto, UpdateRuleDto } from '../rules/dto/rule.dto'
import { RuleType } from '../rules/entities/rule.enum'

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Rule)
    private rulesRepository: Repository<Rule>
  ) {}

  async findAll(): Promise<Course[]> {
    return this.coursesRepository.find()
  }

  async findOne(id: number): Promise<Course> {
    const course = await this.coursesRepository.findOne({ where: { id } })
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`)
    }
    return course
  }

  async findByCodeAndVersion(code: string, version: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { code, version },
    })
    if (!course) {
      throw new NotFoundException(`Course with code "${code}" and version "${version}" not found`)
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

  // Rule-related methods

  async findAllRules(courseId: number): Promise<Rule[]> {
    const course = await this.findOne(courseId)
    return this.rulesRepository.find({ where: { course: { id: course.id } } })
  }

  async findOneRule(courseId: number, ruleId: number): Promise<Rule> {
    const course = await this.findOne(courseId)
    const rule = await this.rulesRepository.findOne({
      where: { id: ruleId, course: { id: course.id } },
    })
    if (!rule) {
      throw new NotFoundException(`Rule with ID "${ruleId}" not found in course "${courseId}"`)
    }
    return rule
  }

  async findRuleByType(courseId: number, type: RuleType): Promise<Rule> {
    const course = await this.findOne(courseId)
    const rule = await this.rulesRepository.findOne({
      where: { type, course: { id: course.id } },
    })
    if (!rule) {
      throw new NotFoundException(`Rule with type "${type}" not found in course "${courseId}"`)
    }
    return rule
  }

  async createRule(courseId: number, createRuleDto: CreateRuleDto): Promise<Rule> {
    const course = await this.findOne(courseId)
    const rule = this.rulesRepository.create({ ...createRuleDto, course })
    return this.rulesRepository.save(rule)
  }

  async updateRule(courseId: number, ruleId: number, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    const rule = await this.findOneRule(courseId, ruleId)
    Object.assign(rule, updateRuleDto)
    return this.rulesRepository.save(rule)
  }

  async updateRuleByType(
    courseId: number,
    type: RuleType,
    updateRuleDto: UpdateRuleDto
  ): Promise<Rule> {
    const rule = await this.findRuleByType(courseId, type)
    Object.assign(rule, updateRuleDto)
    return this.rulesRepository.save(rule)
  }

  async removeRule(courseId: number, ruleId: number): Promise<void> {
    const rule = await this.findOneRule(courseId, ruleId)
    await this.rulesRepository.remove(rule)
  }

  async removeRuleByType(courseId: number, type: RuleType): Promise<void> {
    const rule = await this.findRuleByType(courseId, type)
    await this.rulesRepository.remove(rule)
  }
}
