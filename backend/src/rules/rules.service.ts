// src/rules/rules.service.ts

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Rule } from './entities/rule.entity'
import { RuleHistory } from './entities/rule-history.entity'
import { CreateRuleDto, UpdateRuleDto, RuleDto } from './dto/rule.dto'
import { RuleHistoryDto } from './dto/rule-history.dto'

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule)
    private rulesRepository: Repository<Rule>,
    @InjectRepository(RuleHistory)
    private ruleHistoryRepository: Repository<RuleHistory>
  ) {}

  async findAll(
    page: number,
    limit: number,
    search: string
  ): Promise<{ rules: Rule[]; total: number }> {
    const query = this.rulesRepository.createQueryBuilder('rule')

    if (search) {
      query.where('rule.code LIKE :search', { search: `%${search}%` })
    }

    const [rules, total] = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount()

    return { rules, total }
  }

  async findOne(id: number): Promise<RuleDto> {
    const rule = await this.rulesRepository.findOne({ where: { id } })
    return rule ? this.toRuleDto(rule) : null
  }

  async create(createRuleDto: CreateRuleDto): Promise<RuleDto> {
    const rule = this.rulesRepository.create(createRuleDto)
    const savedRule = await this.rulesRepository.save(rule)
    await this.createRuleHistory(savedRule)
    return this.toRuleDto(savedRule)
  }

  async update(id: number, updateRuleDto: UpdateRuleDto): Promise<RuleDto> {
    const rule = await this.rulesRepository.findOne({ where: { id } })
    if (!rule) {
      return null
    }
    Object.assign(rule, updateRuleDto)
    const updatedRule = await this.rulesRepository.save(rule)
    await this.createRuleHistory(updatedRule)
    return this.toRuleDto(updatedRule)
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.rulesRepository.delete(id)
    return result.affected > 0
  }

  async getRuleHistory(id: number): Promise<RuleHistoryDto[]> {
    const history = await this.ruleHistoryRepository.find({
      where: { ruleId: id },
      order: { version: 'DESC' },
    })
    return history.map(this.toRuleHistoryDto)
  }

  async restoreRuleVersion(id: number, version: number): Promise<RuleDto> {
    try {
      console.log(`Attempting to restore rule ${id} to version ${version}`)

      const historicalRule = await this.ruleHistoryRepository.findOne({
        where: { ruleId: id, version },
      })
      if (!historicalRule) {
        console.log(`Historical rule not found for id ${id} and version ${version}`)
        return null
      }

      const rule = await this.rulesRepository.findOne({ where: { id } })
      if (!rule) {
        console.log(`Current rule not found for id ${id}`)
        return null
      }

      Object.assign(rule, {
        code: historicalRule.code,
        name: historicalRule.name,
        type: historicalRule.type,
        description: historicalRule.description,
      })

      const restoredRule = await this.rulesRepository.save(rule)
      console.log(`Rule ${id} restored to version ${version}`)

      await this.createRuleHistory(restoredRule)
      console.log(`New history entry created for restored rule ${id}`)

      return this.toRuleDto(restoredRule)
    } catch (error) {
      console.error('Error in restoreRuleVersion:', error)
      throw error
    }
  }

  private async createRuleHistory(rule: Rule): Promise<void> {
    const latestHistory = await this.ruleHistoryRepository.findOne({
      where: { ruleId: rule.id },
      order: { version: 'DESC' },
    })
    const newVersion = latestHistory ? latestHistory.version + 1 : 1
    const historyEntry = this.ruleHistoryRepository.create({
      ruleId: rule.id,
      code: rule.code,
      name: rule.name,
      type: rule.type,
      description: rule.description,
      version: newVersion,
      timestamp: new Date(), // 添加这行
    })
    await this.ruleHistoryRepository.save(historyEntry)
  }

  private toRuleDto(rule: Rule): RuleDto {
    return {
      id: rule.id,
      code: rule.code,
      name: rule.name,
      type: rule.type,
      description: rule.description,
    }
  }

  private toRuleHistoryDto(history: RuleHistory): RuleHistoryDto {
    return {
      id: history.id,
      ruleId: history.ruleId,
      code: history.code,
      name: history.name,
      type: history.type,
      description: history.description,
      version: history.version,
      timestamp: history.timestamp,
    }
  }
}
