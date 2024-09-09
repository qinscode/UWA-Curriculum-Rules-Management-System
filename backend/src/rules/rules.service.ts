import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Rule } from './entities/rule.entity'
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto'
import { RuleType } from './entities/rule.enum'

@Injectable()
export class RulesService {
  private readonly logger = new Logger(RulesService.name)

  constructor(
    @InjectRepository(Rule)
    private rulesRepository: Repository<Rule>
  ) {}

  async findAll(): Promise<Rule[]> {
    return this.rulesRepository.find({ relations: ['course'] })
  }

  async findOne(id: number): Promise<Rule> {
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

  async findByType(type: RuleType): Promise<Rule[]> {
    return this.rulesRepository.find({ where: { type }, relations: ['course', 'requirements'] })
  }

  async create(createRuleDto: CreateRuleDto): Promise<Rule> {
    const rule = this.rulesRepository.create(createRuleDto)
    return this.rulesRepository.save(rule)
  }

  async update(id: number, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    const rule = await this.findOne(id)
    Object.assign(rule, updateRuleDto)
    return this.rulesRepository.save(rule)
  }

  async remove(id: number): Promise<void> {
    const rule = await this.findOne(id)
    await this.rulesRepository.remove(rule)
  }
}
