import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule } from './entities/rule.entity';
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule)
    private rulesRepository: Repository<Rule>,
  ) {}

  findAll(): Promise<Rule[]> {
    return this.rulesRepository.find();
  }

  create(createRuleDto: CreateRuleDto): Promise<Rule> {
    const rule = this.rulesRepository.create(createRuleDto);
    return this.rulesRepository.save(rule);
  }

  async update(id: number, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    await this.rulesRepository.update(id, updateRuleDto);
    return this.rulesRepository.findOne({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.rulesRepository.delete(id);
  }
}