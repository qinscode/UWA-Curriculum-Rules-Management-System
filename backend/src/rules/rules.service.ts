import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Rule } from './entities/rule.entity'
import { Requirement } from './entities/requirement.entity'
import { Course } from '../courses/entities/course.entity'
import { CreateRuleDto, UpdateRuleDto } from './dto'

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rule)
    private rulesRepository: Repository<Rule>,
    @InjectRepository(Requirement)
    private requirementsRepository: Repository<Requirement>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>
  ) {}

  async findAll(courseId: number): Promise<Rule[]> {
    return this.rulesRepository.find({
      where: { course: { id: courseId } },
      relations: ['requirements'],
    })
  }

  async findOne(courseId: number, id: number): Promise<Rule> {
    const rule = await this.rulesRepository.findOne({
      where: { id, course: { id: courseId } },
      relations: ['requirements'],
    })
    if (!rule) {
      throw new NotFoundException(`Rule with ID "${id}" not found in course "${courseId}"`)
    }
    return rule
  }

  async create(courseId: number, createRuleDto: CreateRuleDto): Promise<Rule> {
    const course = await this.coursesRepository.findOne({ where: { id: courseId } })
    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`)
    }

    const rule = this.rulesRepository.create({
      ...createRuleDto,
      course,
    })

    const savedRule = await this.rulesRepository.save(rule)

    if (createRuleDto.requirements) {
      const requirements = createRuleDto.requirements.map((req) =>
        this.requirementsRepository.create({ ...req, rule: savedRule })
      )
      await this.requirementsRepository.save(requirements)
    }

    return this.findOne(courseId, savedRule.id)
  }

  async update(courseId: number, id: number, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    const rule = await this.findOne(courseId, id)

    Object.assign(rule, updateRuleDto)

    if (updateRuleDto.requirements) {
      // Remove existing requirements
      await this.requirementsRepository.delete({ rule: { id } })

      // Create new requirements
      const requirements = updateRuleDto.requirements.map((req) =>
        this.requirementsRepository.create({ ...req, rule })
      )
      await this.requirementsRepository.save(requirements)
    }

    await this.rulesRepository.save(rule)
    return this.findOne(courseId, id)
  }

  async remove(courseId: number, id: number): Promise<void> {
    const rule = await this.findOne(courseId, id)
    await this.rulesRepository.remove(rule)
  }
}
