import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { DeepPartial } from 'typeorm'
import { NumberingStyle } from '../requirements/entities/style.enum'

@Injectable()
export class PresetRulesService {
  private readonly logger = new Logger(PresetRulesService.name)

  constructor(
    @InjectRepository(PresetRule)
    private rulesRepository: Repository<PresetRule>,
    @InjectRepository(Requirement)
    private requirementsRepository: Repository<Requirement>
  ) {}

  async findAll(): Promise<PresetRule[]> {
    return this.rulesRepository.find({ relations: ['course'] })
  }

  async findOne(id: number): Promise<PresetRule> {
    const rule = await this.rulesRepository.findOne({
      where: { id },
      relations: ['course', 'requirements'],
    })
    if (!rule) {
      this.logger.warn(`Rule with ID "${id}" not found`)
      throw new NotFoundException(`Rule with ID "${id}" not found`)
    }
    return rule
  }

  async findByType(type: PresetRuleType): Promise<PresetRule[]> {
    return this.rulesRepository.find({ where: { type }, relations: ['course', 'requirements'] })
  }

  async create(createRuleDto: CreatePresetRuleDto): Promise<PresetRule> {
    const rule = this.rulesRepository.create({
      ...createRuleDto,
      requirements: createRuleDto.requirements?.map((req) => ({
        ...req,
        style: req.style as NumberingStyle,
      })),
    } as DeepPartial<PresetRule>)
    return this.rulesRepository.save(rule)
  }

  async update(id: number, updateRuleDto: UpdatePresetRuleDto): Promise<PresetRule> {
    const rule = await this.findOne(id)
    Object.assign(rule, updateRuleDto)
    return this.rulesRepository.save(rule)
  }

  async remove(id: number): Promise<void> {
    const rule = await this.findOne(id)
    await this.rulesRepository.remove(rule)
  }

  async findAllRules(courseId: number): Promise<PresetRule[]> {
    return this.rulesRepository.find({
      where: { course: { id: courseId } },
      order: { id: 'ASC' },
    })
  }

  async findRuleRequirementsHierarchy(ruleId: number): Promise<PresetRequirement[]> {
    const requirements = await this.requirementsRepository.find({
      where: { rule: { id: ruleId }, parent: null },
      relations: ['children'],
      order: { order_index: 'ASC' },
    })

    return this.loadChildrenRecursively(requirements)
  }

  private async loadChildrenRecursively(
    requirements: PresetRequirement[]
  ): Promise<PresetRequirement[]> {
    for (const requirement of requirements) {
      if (requirement.children && requirement.children.length > 0) {
        requirement.children = await this.loadChildrenRecursively(requirement.children)
      }
    }
    return requirements.sort((a, b) => a.order_index - b.order_index)
  }
}
