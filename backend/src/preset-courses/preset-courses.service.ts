import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { PresetCourse } from './entities/preset-course.entity'
import { CreatePresetCourseDto, UpdatePresetCourseDto } from './dto'
import { PresetRuleType } from '../preset-rules/entities/preset-rule.enum'
import { PresetRule } from '../preset-rules/entities/preset-rule.entity'
import { CreatePresetRuleDto, UpdatePresetRuleDto } from '../preset-rules/dto/preset-rule.dto'
import { NumberingStyle } from '../requirements/entities/style.enum'

@Injectable()
export class PresetCoursesService {
  constructor(
    @InjectRepository(PresetCourse)
    private presetCoursesRepository: Repository<PresetCourse>,
    @InjectRepository(PresetRule)
    private rulesRepository: Repository<PresetRule>
  ) {}

  async findAll(): Promise<any[]> {
    // 获取所有课程
    const allCourses = await this.presetCoursesRepository.find({
      order: { code: 'ASC', version: 'DESC' },
    })

    // 使用 Map 来存储每个课程代码的最新版本
    const latestVersions = new Map<string, PresetCourse>()

    allCourses.forEach((course) => {
      if (!latestVersions.has(course.code)) {
        latestVersions.set(course.code, course)
      }
    })

    // 为每个最新版本的课程添加 versions 字段
    return await Promise.all(
      Array.from(latestVersions.values()).map(async (course) => {
        const versions = await this.presetCoursesRepository
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

  // 根据 ID 查找单个课程，并动态生成 versions 字段
  async findOne(id: number): Promise<any> {
    const course = await this.presetCoursesRepository.findOne({ where: { id } })

    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`)
    }

    // 查询与当前课程 code 相同的所有版本
    const relatedCourses = await this.presetCoursesRepository.find({
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
  async create(createCourseDto: CreatePresetCourseDto): Promise<PresetCourse> {
    const course = this.presetCoursesRepository.create(createCourseDto)
    return this.presetCoursesRepository.save(course)
  }

  // 更新课程信息
  async update(id: number, updateCourseDto: UpdatePresetCourseDto): Promise<PresetCourse> {
    const course = await this.findOne(id)
    Object.assign(course, updateCourseDto)
    return this.presetCoursesRepository.save(course)
  }

  // 删除课程
  async remove(id: number): Promise<void> {
    const course = await this.findOne(id)
    await this.presetCoursesRepository.remove(course)
  }

  async findByCodeAndVersion(code: string, version: string): Promise<PresetCourse> {
    const course = await this.presetCoursesRepository.findOne({
      where: { code, version: version.toString() },
    })

    if (!course) {
      throw new NotFoundException(`Course with code "${code}" and version "${version}" not found`)
    }

    return course
  }

  async findAllRules(courseId: number): Promise<PresetRule[]> {
    const course = await this.findOne(courseId)
    return this.rulesRepository.find({ where: { course: { id: course.id } } })
  }

  async findOneRule(courseId: number, ruleId: number): Promise<PresetRule> {
    const course = await this.findOne(courseId)
    return this.rulesRepository.findOne({ where: { id: ruleId, course: { id: course.id } } })
  }

  async findRuleByType(courseId: number, type: PresetRuleType): Promise<PresetRule> {
    const course = await this.findOne(courseId)
    return this.rulesRepository.findOne({ where: { type, course: { id: course.id } } })
  }

  async createRule(courseId: number, createRuleDto: CreatePresetRuleDto): Promise<PresetRule> {
    const course = await this.findOne(courseId)
    const rule = this.rulesRepository.create({
      ...createRuleDto,
      course,
      requirements: createRuleDto.requirements?.map((req) => ({
        ...req,
        style: req.style as NumberingStyle,
      })),
    } as DeepPartial<PresetRule>)
    return this.rulesRepository.save(rule as PresetRule)
  }

  async updateRule(
    courseId: number,
    ruleId: number,
    updateRuleDto: UpdatePresetRuleDto
  ): Promise<PresetRule> {
    const rule = await this.findOneRule(courseId, ruleId)
    if (!rule) {
      throw new NotFoundException(`Rule with ID "${ruleId}" not found in course "${courseId}"`)
    }
    Object.assign(rule, updateRuleDto)
    return this.rulesRepository.save(rule)
  }

  async updateRuleByType(
    courseId: number,
    type: PresetRuleType,
    updateRuleDto: UpdatePresetRuleDto
  ): Promise<PresetRule> {
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

  async removeRuleByType(courseId: number, type: PresetRuleType): Promise<void> {
    const rule = await this.findRuleByType(courseId, type)
    if (!rule) {
      throw new NotFoundException(`Rule with type "${type}" not found in course "${courseId}"`)
    }
    await this.rulesRepository.remove(rule)
  }
}
