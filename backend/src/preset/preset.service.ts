import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Rule } from './entities/preset.entity'
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto'
import { RuleType } from './entities/preset.enum'
import { Requirement } from '../requirements/entities/requirement.entity'

@Injectable()
export class PresetService {
  private readonly logger = new Logger(PresetService.name)

  constructor(
    @InjectRepository(Rule)
    private presetRepository: Repository<Rule>,
    @InjectRepository(Requirement)
    private requirementsRepository: Repository<Requirement>
  ) {}

  async findAll(): Promise<Rule[]> {
    return this.presetRepository.find({ relations: ['course'] })
  }

  async findOne(id: number): Promise<Rule> {
    const rule = await this.presetRepository.findOne({
      where: { id },
      relations: ['course', 'requirements'],
    })
    if (!rule) {
      this.logger.warn(`Rule with ID "${id}" not found`)
      throw new NotFoundException(`Rule with ID "${id}" not found`)
    }
    return rule
  }

  async findByType(type: RuleType): Promise<Rule[]> {
    return this.presetRepository.find({ where: { type }, relations: ['course', 'requirements'] })
  }

  async create(createRuleDto: CreateRuleDto): Promise<Rule> {
    const rule = this.presetRepository.create(createRuleDto)
    return this.presetRepository.save(rule)
  }

  async update(id: number, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    const rule = await this.findOne(id)
    Object.assign(rule, updateRuleDto)
    return this.presetRepository.save(rule)
  }

  async remove(id: number): Promise<void> {
    const rule = await this.findOne(id)
    await this.presetRepository.remove(rule)
  }

  async findAllPreset(courseId: number): Promise<Rule[]> {
    return this.presetRepository.find({
      where: { course: { id: courseId } },
      order: { id: 'ASC' },
    })
  }

  async findRuleRequirementsHierarchy(ruleId: number): Promise<Requirement[]> {
    const requirements = await this.requirementsRepository.find({
      where: { rule: { id: ruleId }, parent: null },
      relations: ['children'],
      order: { order_index: 'ASC' },
    })

    return this.loadChildrenRecursively(requirements)
  }

  private async loadChildrenRecursively(requirements: Requirement[]): Promise<Requirement[]> {
    for (const requirement of requirements) {
      if (requirement.children && requirement.children.length > 0) {
        requirement.children = await this.loadChildrenRecursively(requirement.children)
      }
    }
    return requirements.sort((a, b) => a.order_index - b.order_index)
  }
}
