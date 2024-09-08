import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Requirement } from './entities/requirement.entity'
import { Rule } from '../rules/entities/rule.entity'
import { CreateRequirementDto, UpdateRequirementDto } from './dto/requirement.dto'

@Injectable()
export class RequirementsService {
  private readonly logger = new Logger(RequirementsService.name)

  constructor(
    @InjectRepository(Requirement)
    private requirementsRepository: Repository<Requirement>,
    @InjectRepository(Rule)
    private rulesRepository: Repository<Rule>,
    private dataSource: DataSource
  ) {}

  async findAllRequirements(courseId: number, ruleId: number): Promise<Requirement[]> {
    this.logger.log(`Fetching all requirements for rule ${ruleId} in course ${courseId}`)
    return this.requirementsRepository.find({
      where: { rule: { id: ruleId, course: { id: courseId } } },
      order: { order_index: 'ASC' },
    })
  }

  async createRequirement(
    courseId: number,
    ruleId: number,
    createRequirementDto: CreateRequirementDto
  ): Promise<Requirement> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const rule = await this.rulesRepository.findOne({
        where: { id: ruleId, course: { id: courseId } },
      })
      if (!rule) {
        throw new NotFoundException(`Rule with ID "${ruleId}" not found in course "${courseId}"`)
      }

      const requirement = this.requirementsRepository.create({
        content: createRequirementDto.content,
        style: createRequirementDto.style,
        isConnector: createRequirementDto.is_connector,
        order_index: createRequirementDto.order_index,
        rule,
      })

      this.logger.log(`Creating requirement: ${JSON.stringify(requirement)}`)
      const savedRequirement = await queryRunner.manager.save(requirement)
      this.logger.log(`Saved requirement: ${JSON.stringify(savedRequirement)}`)

      if (createRequirementDto.children && createRequirementDto.children.length > 0) {
        await this.createChildren(savedRequirement, createRequirementDto.children, queryRunner)
      }

      await queryRunner.commitTransaction()
      this.logger.log(`Created new requirement with ID ${savedRequirement.id} for rule ${ruleId}`)

      return this.requirementsRepository.findOne({
        where: { id: savedRequirement.id },
        relations: ['children'],
      })
    } catch (err) {
      this.logger.error(`Failed to create requirement for rule ${ruleId}`, err.stack)
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException('Failed to create requirement')
    } finally {
      await queryRunner.release()
    }
  }

  private async createChildren(
    parentRequirement: Requirement,
    children: CreateRequirementDto[],
    queryRunner: any
  ): Promise<void> {
    for (const childDto of children) {
      const childRequirement = this.requirementsRepository.create({
        content: childDto.content,
        style: childDto.style,
        isConnector: childDto.is_connector,
        order_index: childDto.order_index,
        parent: parentRequirement,
        rule: parentRequirement.rule,
      })

      this.logger.log(`Creating child requirement: ${JSON.stringify(childRequirement)}`)
      const savedChild = await queryRunner.manager.save(childRequirement)
      this.logger.log(`Saved child requirement: ${JSON.stringify(savedChild)}`)

      if (childDto.children && childDto.children.length > 0) {
        await this.createChildren(savedChild, childDto.children, queryRunner)
      }
    }
  }

  async updateRequirement(
    courseId: number,
    ruleId: number,
    requirementId: number,
    updateRequirementDto: UpdateRequirementDto
  ): Promise<Requirement> {
    const requirement = await this.requirementsRepository.findOne({
      where: { id: requirementId, rule: { id: ruleId, course: { id: courseId } } },
    })

    if (!requirement) {
      throw new NotFoundException(
        `Requirement with ID "${requirementId}" not found in rule "${ruleId}" and course "${courseId}"`
      )
    }

    Object.assign(requirement, updateRequirementDto)
    return this.requirementsRepository.save(requirement)
  }

  async removeRequirement(courseId: number, ruleId: number, requirementId: number): Promise<void> {
    const requirement = await this.requirementsRepository.findOne({
      where: { id: requirementId, rule: { id: ruleId, course: { id: courseId } } },
    })

    if (!requirement) {
      throw new NotFoundException(`Requirement with ID "${requirementId}" not found`)
    }

    await this.requirementsRepository.remove(requirement)
  }

  async addChildRequirement(
    courseId: number,
    ruleId: number,
    requirementId: number,
    createRequirementDto: CreateRequirementDto
  ): Promise<Requirement> {
    const parentRequirement = await this.requirementsRepository.findOne({
      where: { id: requirementId, rule: { id: ruleId, course: { id: courseId } } },
    })

    if (!parentRequirement) {
      throw new NotFoundException(`Parent requirement with ID "${requirementId}" not found`)
    }

    const childRequirement = this.requirementsRepository.create({
      ...createRequirementDto,
      parent: parentRequirement,
      rule: parentRequirement.rule,
    })

    return this.requirementsRepository.save(childRequirement)
  }

  async findChildren(
    courseId: number,
    ruleId: number,
    requirementId: number
  ): Promise<Requirement[]> {
    return this.requirementsRepository.find({
      where: { parent: { id: requirementId }, rule: { id: ruleId, course: { id: courseId } } },
      order: { order_index: 'ASC' },
    })
  }
}
