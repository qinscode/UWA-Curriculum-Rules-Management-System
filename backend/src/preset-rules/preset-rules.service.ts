import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PresetRule } from './entities/preset-rule.entity'
import { CreatePresetRuleDto, UpdatePresetRuleDto } from './dto/preset-rule.dto'
import { PresetRuleType } from './entities/preset-rule.enum'
import { PresetRequirement } from '../preset-requirements/entities/preset-requirement.entity'
import { DeepPartial } from 'typeorm'
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
    return this.presetRulesRepository.find({ relations: ['presetCourse'] })
  }

  async findOne(id: number): Promise<PresetRule> {
    const presetRule = await this.presetRulesRepository.findOne({
      where: { id },
      relations: ['presetCourse', 'presetRequirements'],
    })
    if (!presetRule) {
      this.logger.warn(`Preset rule with ID "${id}" not found`)
      throw new NotFoundException(`Preset rule with ID "${id}" not found`)
    }
    return presetRule
  }

  async findByType(type: PresetRuleType): Promise<PresetRule[]> {
    return this.presetRulesRepository.find({
      where: { type },
      relations: ['presetCourse', 'presetRequirements'],
    })
  }

  async create(createPresetRuleDto: CreatePresetRuleDto): Promise<PresetRule> {
    const presetRule = this.presetRulesRepository.create({
      ...createPresetRuleDto,
      presetRequirements: createPresetRuleDto.presetRequirements?.map((req) => ({
        ...req,
        style: req.style as NumberingStyle,
      })),
    } as DeepPartial<PresetRule>)
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

  async findAllPresetRules(presetCourseId: number): Promise<PresetRule[]> {
    return this.presetRulesRepository.find({
      where: { presetCourse: { id: presetCourseId } },
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
}
