import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { PresetCourse } from './entities/preset-course.entity'
import { CreatePresetCourseDto, UpdatePresetCourseDto } from './dto'
import { PresetRuleType } from '../preset-rules/entities/preset-rule.enum'
import { PresetRule } from '../preset-rules/entities/preset-rule.entity'
import { CreatePresetRuleDto, UpdatePresetRuleDto } from '../preset-rules/dto/preset-rule.dto'
import { NumberingStyle } from '../preset-requirements/entities/style.enum'
import { PresetCourseType } from './entities/preset-course-type.enum'

@Injectable()
export class PresetCoursesService {
  private readonly logger = new Logger(PresetCoursesService.name)

  constructor(
    @InjectRepository(PresetCourse)
    private presetCoursesRepository: Repository<PresetCourse>,
    @InjectRepository(PresetRule)
    private presetRulesRepository: Repository<PresetRule>
  ) {}

  async findAll(): Promise<any[]> {
    const allPresetCourses = await this.presetCoursesRepository.find({
      order: { code: 'ASC', version: 'DESC' },
    })

    const latestVersions = new Map<string, PresetCourse>()

    allPresetCourses.forEach((presetCourse) => {
      if (!latestVersions.has(presetCourse.code)) {
        latestVersions.set(presetCourse.code, presetCourse)
      }
    })

    return await Promise.all(
      Array.from(latestVersions.values()).map(async (presetCourse) => {
        const versions = await this.presetCoursesRepository
          .createQueryBuilder('presetCourse')
          .select('presetCourse.version', 'version')
          .where('presetCourse.code = :code', { code: presetCourse.code })
          .orderBy('presetCourse.version', 'DESC')
          .getRawMany()

        return {
          ...presetCourse,
          versions: versions.map((v) => v.version.toString()),
        }
      })
    )
  }

  async findOne(id: number): Promise<any> {
    const presetCourse = await this.presetCoursesRepository.findOne({ where: { id } })

    if (!presetCourse) {
      throw new NotFoundException(`Preset course with ID "${id}" not found`)
    }

    const relatedPresetCourses = await this.presetCoursesRepository.find({
      where: { code: presetCourse.code },
      order: { version: 'DESC' },
    })

    const versions = relatedPresetCourses.map((c) => c.version.toString())

    return {
      ...presetCourse,
      versions,
    }
  }

  async create(createPresetCourseDto: CreatePresetCourseDto): Promise<PresetCourse> {
    this.logger.log(
      `Creating new preset course with data: ${JSON.stringify(createPresetCourseDto)}`
    )

    try {
      this.logger.log('Creating entity from DTO...')
      const newPresetCourse = this.presetCoursesRepository.create(createPresetCourseDto)

      this.logger.log('Entity created, attempting to save...')
      this.logger.log(`Entity to be saved: ${JSON.stringify(newPresetCourse)}`)

      const savedCourse = await this.presetCoursesRepository.save(newPresetCourse)

      this.logger.log(`Successfully saved preset course with ID: ${savedCourse.id}`)
      this.logger.log(`Saved course data: ${JSON.stringify(savedCourse)}`)

      // Add default rules
      await this.addDefaultRules(savedCourse)

      return savedCourse
    } catch (error) {
      this.logger.error(`Failed to create preset course: ${error.message}`, error.stack)
      if (error.code) {
        this.logger.error(`Database error code: ${error.code}`)
      }
      if (error.detail) {
        this.logger.error(`Error detail: ${error.detail}`)
      }
      throw error
    }
  }

  private async addDefaultRules(presetCourse: PresetCourse): Promise<void> {
    const defaultRules: Partial<PresetRule>[] = Object.values(PresetRuleType).map((type) => ({
      name: type,
      type,
      description: `Default description for ${type}`,
      presetCourse,
    }))

    this.logger.log(`Adding default rules for preset course: ${presetCourse.id}`)

    try {
      await this.presetRulesRepository.save(defaultRules)
      this.logger.log(`Successfully added default rules for preset course: ${presetCourse.id}`)
    } catch (error) {
      this.logger.error(`Failed to add default rules: ${error.message}`, error.stack)
      throw error
    }
  }

  async update(id: number, updatePresetCourseDto: UpdatePresetCourseDto): Promise<PresetCourse> {
    const presetCourse = await this.findOne(id)
    Object.assign(presetCourse, updatePresetCourseDto)
    return this.presetCoursesRepository.save(presetCourse)
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Attempting to remove preset course with ID: ${id}`)

    try {
      const presetCourse = await this.presetCoursesRepository.findOne({ where: { id } })

      if (!presetCourse) {
        this.logger.warn(`Preset course with ID "${id}" not found for deletion`)
        throw new NotFoundException(`Preset course with ID "${id}" not found`)
      }

      this.logger.log(`Found preset course to delete: ${JSON.stringify(presetCourse)}`)

      const result = await this.presetCoursesRepository.delete(id)

      this.logger.log(`Delete operation result: ${JSON.stringify(result)}`)

      if (result.affected === 0) {
        this.logger.warn(`No preset course was deleted with ID "${id}"`)
        throw new NotFoundException(`Preset course with ID "${id}" not found`)
      }

      this.logger.log(`Successfully deleted preset course with ID: ${id}`)
    } catch (error) {
      this.logger.error(
        `Error while deleting preset course with ID ${id}: ${error.message}`,
        error.stack
      )
      throw error
    }
  }

  async findByCodeAndVersion(code: string, version: string): Promise<PresetCourse> {
    const presetCourse = await this.presetCoursesRepository.findOne({
      where: { code, version: version.toString() },
    })

    if (!presetCourse) {
      throw new NotFoundException(
        `Preset course with code "${code}" and version "${version}" not found`
      )
    }

    return presetCourse
  }

  async findAllPresetRules(presetCourseId: number): Promise<PresetRule[]> {
    const presetCourse = await this.findOne(presetCourseId)
    return this.presetRulesRepository.find({ where: { presetCourse: { id: presetCourse.id } } })
  }

  async findOnePresetRule(presetCourseId: number, presetRuleId: number): Promise<PresetRule> {
    const presetCourse = await this.findOne(presetCourseId)
    return this.presetRulesRepository.findOne({
      where: { id: presetRuleId, presetCourse: { id: presetCourse.id } },
    })
  }

  async findPresetRuleByType(presetCourseId: number, type: PresetRuleType): Promise<PresetRule> {
    const presetCourse = await this.findOne(presetCourseId)
    return this.presetRulesRepository.findOne({
      where: { type, presetCourse: { id: presetCourse.id } },
    })
  }

  async createPresetRule(
    presetCourseId: number,
    createPresetRuleDto: CreatePresetRuleDto
  ): Promise<PresetRule> {
    const presetCourse = await this.findOne(presetCourseId)
    const presetRule = this.presetRulesRepository.create({
      ...createPresetRuleDto,
      presetCourse,
      presetRequirements: createPresetRuleDto.presetRequirements?.map((req) => ({
        ...req,
        style: req.style as NumberingStyle,
      })),
    } as DeepPartial<PresetRule>)
    return this.presetRulesRepository.save(presetRule as PresetRule)
  }

  async updatePresetRule(
    presetCourseId: number,
    presetRuleId: number,
    updatePresetRuleDto: UpdatePresetRuleDto
  ): Promise<PresetRule> {
    const presetRule = await this.findOnePresetRule(presetCourseId, presetRuleId)
    if (!presetRule) {
      throw new NotFoundException(
        `Preset rule with ID "${presetRuleId}" not found in preset course "${presetCourseId}"`
      )
    }
    Object.assign(presetRule, updatePresetRuleDto)
    return this.presetRulesRepository.save(presetRule)
  }

  async updatePresetRuleByType(
    presetCourseId: number,
    type: PresetRuleType,
    updatePresetRuleDto: UpdatePresetRuleDto
  ): Promise<PresetRule> {
    const presetRule = await this.findPresetRuleByType(presetCourseId, type)
    if (!presetRule) {
      throw new NotFoundException(
        `Preset rule with type "${type}" not found in preset course "${presetCourseId}"`
      )
    }
    Object.assign(presetRule, updatePresetRuleDto)
    return this.presetRulesRepository.save(presetRule)
  }

  async removePresetRule(presetCourseId: number, presetRuleId: number): Promise<void> {
    const presetRule = await this.findOnePresetRule(presetCourseId, presetRuleId)
    if (!presetRule) {
      throw new NotFoundException(
        `Preset rule with ID "${presetRuleId}" not found in preset course "${presetCourseId}"`
      )
    }
    await this.presetRulesRepository.remove(presetRule)
  }

  async removePresetRuleByType(presetCourseId: number, type: PresetRuleType): Promise<void> {
    const presetRule = await this.findPresetRuleByType(presetCourseId, type)
    if (!presetRule) {
      throw new NotFoundException(
        `Preset rule with type "${type}" not found in preset course "${presetCourseId}"`
      )
    }
    await this.presetRulesRepository.remove(presetRule)
  }

  async findAllPresetRulesByType(type: PresetCourseType): Promise<PresetRule[]> {
    const presetCourses = await this.presetCoursesRepository.find({
      where: { type },
      relations: ['presetRules', 'presetRules.presetRequirements'],
    })

    const allPresetRules = presetCourses.flatMap((course) => course.presetRules)

    // Sort the preset rules by ID in ascending order
    return allPresetRules.sort((a, b) => a.id - b.id)
  }

  async findPresetRulesByType(type: PresetCourseType): Promise<PresetRule[]> {
    this.logger.log(`Searching for preset course with type: ${type}`)

    const presetCourse = await this.presetCoursesRepository.findOne({
      where: { type },
      relations: ['presetRules', 'presetRules.presetRequirements'],
    })

    if (!presetCourse) {
      this.logger.warn(`No preset course found for type: ${type}`)
      return []
    }

    this.logger.log(`Found preset course with ID: ${presetCourse.id} for type: ${type}`)

    if (presetCourse.presetRules.length === 0) {
      this.logger.warn(`Preset course found for type: ${type}, but it has no preset rules`)
    } else {
      this.logger.log(
        `Found ${presetCourse.presetRules.length} preset rules for course type: ${type}`
      )
    }

    // 返回排序后的预设规则数组
    return presetCourse.presetRules.sort((a, b) => a.id - b.id)
  }
}
