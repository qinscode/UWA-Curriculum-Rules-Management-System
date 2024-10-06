import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PresetRule } from './entities/preset-rule.entity'
import { CreatePresetRuleDto, UpdatePresetRuleDto } from './dto/preset-rule.dto'
import { PresetRuleType } from './entities/preset-rule.enum'
import { PresetRequirement } from '../preset-requirements/entities/preset-requirement.entity'
import { CourseType } from '../courses/entities/course-type.enum'
import { PresetRuleWithRequirementsDto } from './dto/preset-rule-with-requirements.dto'
import { PresetRequirementDto } from '../preset-requirements/dto/preset-requirement.dto'
import { NumberingStyle } from '../preset-requirements/entities/style.enum'

@Injectable()
export class PresetRulesService {
  private readonly logger = new Logger(PresetRulesService.name)

  constructor(
    @InjectRepository(PresetRule)
    private presetRulesRepository: Repository<PresetRule>,
    @InjectRepository(PresetRequirement)
    private presetRequirementsRepository: Repository<PresetRequirement>
  ) {}

  async findAll(): Promise<PresetRule[]> {
    return this.presetRulesRepository.find()
  }

  async findOne(id: number): Promise<PresetRule> {
    const presetRule = await this.presetRulesRepository.findOne({
      where: { id },
      relations: ['presetRequirements'],
    })
    if (!presetRule) {
      this.logger.warn(`Preset Rule with ID "${id}" not found`)
      throw new NotFoundException(`Preset Rule with ID "${id}" not found`)
    }
    return presetRule
  }

  async findByType(type: PresetRuleType): Promise<PresetRule[]> {
    return this.presetRulesRepository.find({ where: { type }, relations: ['presetRequirements'] })
  }

  async create(createPresetRuleDto: CreatePresetRuleDto): Promise<PresetRule> {
    const presetRule = this.presetRulesRepository.create(createPresetRuleDto)
    return this.presetRulesRepository.save(presetRule)
  }

  async update(id: number, updatePresetRuleDto: UpdatePresetRuleDto): Promise<PresetRule> {
    const presetRule = await this.findOne(id)
    Object.assign(presetRule, updatePresetRuleDto)
    return this.presetRulesRepository.save(presetRule)
  }

  async remove(id: number): Promise<void> {
    const presetRule = await this.findOne(id)
    await this.presetRulesRepository.remove(presetRule)
  }

  async findAllPresetRules(): Promise<PresetRule[]> {
    return this.presetRulesRepository.find({
      order: { id: 'ASC' },
    })
  }

  async findPresetRuleRequirementsHierarchy(presetRuleId: number): Promise<PresetRequirement[]> {
    const presetRequirements = await this.presetRequirementsRepository.find({
      where: { presetRule: { id: presetRuleId }, parent: null },
      relations: ['children'],
      order: { order_index: 'ASC' },
    })

    return this.loadChildrenRecursively(presetRequirements)
  }

  private async loadChildrenRecursively(
    presetRequirements: PresetRequirement[]
  ): Promise<PresetRequirement[]> {
    for (const presetRequirement of presetRequirements) {
      if (presetRequirement.children && presetRequirement.children.length > 0) {
        presetRequirement.children = await this.loadChildrenRecursively(presetRequirement.children)
      }
    }
    return presetRequirements.sort((a, b) => a.order_index - b.order_index)
  }

  async getUniqueCourseTypes(): Promise<CourseType[]> {
    const result = await this.presetRulesRepository
      .createQueryBuilder('preset_rule')
      .select('DISTINCT preset_rule.course_type', 'course_type')
      .getRawMany()

    return result.map((item) => item.course_type as CourseType)
  }

  async findPresetRulesByCourseType(
    courseType: CourseType
  ): Promise<PresetRuleWithRequirementsDto[]> {
    this.logger.log(`Searching for preset rules with course type: ${courseType}`)

    const presetRules = await this.presetRulesRepository.find({
      where: { course_type: CourseType[courseType] },
      relations: ['presetRequirements'],
      order: { id: 'ASC' },
    })

    this.logger.log(`Found ${presetRules.length} preset rules`)

    if (presetRules.length === 0) {
      this.logger.warn(`No preset rules found for course type: ${courseType}`)
      return []
    }

    return Promise.all(
      presetRules.map(async (rule) => {
        const requirementsHierarchy = await this.buildRequirementsHierarchy(rule.presetRequirements)
        return {
          id: rule.id,
          name: rule.name,
          type: rule.type,
          description: rule.description,
          course_type: rule.course_type,
          requirements: requirementsHierarchy,
        }
      })
    )
  }

  private async buildRequirementsHierarchy(
    requirements: PresetRequirement[]
  ): Promise<PresetRequirementDto[]> {
    this.logger.log(`Building requirements hierarchy for ${requirements.length} requirements`)
    const rootRequirements = requirements.filter((req) => !req.parentId)
    return Promise.all(
      rootRequirements.map(async (req) => this.mapRequirementToDto(req, requirements))
    )
  }

  private async mapRequirementToDto(
    requirement: PresetRequirement,
    allRequirements: PresetRequirement[]
  ): Promise<PresetRequirementDto> {
    const children = allRequirements.filter((req) => req.parentId === requirement.id)
    const childrenDtos = await Promise.all(
      children.map((child) => this.mapRequirementToDto(child, allRequirements))
    )

    return {
      id: requirement.id,
      content: requirement.content,
      style: requirement.style as NumberingStyle, // 确保这里返回的是 NumberingStyle 类型
      is_connector: requirement.is_connector,
      order_index: requirement.order_index,
      children: childrenDtos,
    }
  }
}
