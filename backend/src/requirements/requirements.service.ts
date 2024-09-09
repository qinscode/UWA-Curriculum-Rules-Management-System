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

  async updateRequirements(
    courseId: number,
    ruleId: number,
    updateRequirementDtos: UpdateRequirementDto[]
  ): Promise<Requirement[]> {
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

      // Fetch all existing requirements for this rule
      const existingRequirements = await this.requirementsRepository.find({
        where: { rule: { id: ruleId } },
        relations: ['children'],
      })

      // Delete existing requirements
      await this.deleteRequirementsRecursively(existingRequirements, queryRunner)

      // Create new requirements
      const newRequirements = await this.createRequirementsRecursively(
        rule,
        updateRequirementDtos,
        null,
        queryRunner
      )

      await queryRunner.commitTransaction()
      this.logger.log(`Updated requirements for rule ${ruleId}`)

      return newRequirements
    } catch (err) {
      this.logger.error(`Failed to update requirements for rule ${ruleId}`, err.stack)
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException('Failed to update requirements')
    } finally {
      await queryRunner.release()
    }
  }

  private async deleteRequirementsRecursively(
    requirements: Requirement[],
    queryRunner: any
  ): Promise<void> {
    for (const requirement of requirements) {
      if (requirement.children && requirement.children.length > 0) {
        await this.deleteRequirementsRecursively(requirement.children, queryRunner)
      }
      await queryRunner.manager.remove(Requirement, requirement)
    }
  }

  private async createRequirementsRecursively(
    rule: Rule,
    requirementDtos: UpdateRequirementDto[],
    parent: Requirement | null,
    queryRunner: any
  ): Promise<Requirement[]> {
    const createdRequirements: Requirement[] = []

    for (const dto of requirementDtos) {
      const requirement = this.requirementsRepository.create({
        content: dto.content,
        style: dto.style,
        isConnector: dto.is_connector,
        order_index: dto.order_index,
        rule,
        parent,
      })

      const savedRequirement = await queryRunner.manager.save(requirement)
      this.logger.log(`Created requirement: ${JSON.stringify(savedRequirement)}`)

      if (dto.children && dto.children.length > 0) {
        const children = await this.createRequirementsRecursively(
          rule,
          dto.children,
          savedRequirement,
          queryRunner
        )
        savedRequirement.children = children
      }

      createdRequirements.push(savedRequirement)
    }

    return createdRequirements
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
