import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource, QueryRunner, In } from 'typeorm'
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
  ) { }

  async findAllRequirements(courseId: number, ruleId: number): Promise<Omit<Requirement, 'parentId'>[]> {
    const rule = await this.rulesRepository.findOne({
      where: { id: ruleId, course: { id: courseId } },
    })

    if (!rule) {
      throw new NotFoundException(`Rule with ID ${ruleId} not found in course ${courseId}`)
    }

    const allRequirements = await this.requirementsRepository.find({
      where: { rule: { id: ruleId } },
      order: { order_index: 'ASC' },
    })

    // Build a tree structure
    const requirementMap = new Map<number, Omit<Requirement, 'parentId'> & { children: Omit<Requirement, 'parentId'>[] }>()
    const rootRequirements: (Omit<Requirement, 'parentId'> & { children: Omit<Requirement, 'parentId'>[] })[] = []

    allRequirements.forEach(req => {
      const { parentId, ...reqWithoutParentId } = req
      requirementMap.set(req.id, {
        ...reqWithoutParentId,
        isConnector: Boolean(reqWithoutParentId.isConnector),
        children: []
      })
    })

    allRequirements.forEach(req => {
      const requirement = requirementMap.get(req.id)
      if (req.parentId) {
        const parentReq = requirementMap.get(req.parentId)
        if (parentReq) {
          parentReq.children.push(requirement)
        }
      } else {
        rootRequirements.push(requirement)
      }
    })

    return rootRequirements
  }

  private async loadChildrenRecursively(requirements: Requirement[]): Promise<Requirement[]> {
    for (const requirement of requirements) {
      if (requirement.children && requirement.children.length > 0) {
        requirement.children = await this.loadChildrenRecursively(requirement.children)
      }
    }
    return requirements.sort((a, b) => a.id - b.id)
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
        isConnector: Boolean(createRequirementDto.is_connector), // Explicitly convert to boolean
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
    queryRunner: QueryRunner
  ): Promise<void> {
    for (const childDto of children) {
      const childRequirement = this.requirementsRepository.create({
        content: childDto.content,
        style: childDto.style,
        isConnector: childDto.is_connector,
        order_index: childDto.order_index,
        parentId: parentRequirement.id,
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
    updateRequirementDtos: UpdateRequirementDto | UpdateRequirementDto[]
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

      // Ensure updateRequirementDtos is an array
      const dtos = Array.isArray(updateRequirementDtos)
        ? updateRequirementDtos
        : [updateRequirementDtos]

      // Fetch all existing requirements for this rule
      const existingRequirements = await this.requirementsRepository.find({
        where: { rule: { id: ruleId } },
        relations: ['children'],
      })

      // Update or create requirements
      const updatedRequirements = await this.updateOrCreateRequirements(
        rule,
        dtos,
        existingRequirements,
        null,
        queryRunner
      )

      // Delete requirements that are no longer needed
      await this.deleteUnusedRequirements(existingRequirements, dtos, queryRunner)

      await queryRunner.commitTransaction()
      this.logger.log(`Updated requirements for rule ${ruleId}`)

      return updatedRequirements
    } catch (err) {
      this.logger.error(`Failed to update requirements for rule ${ruleId}`, err.stack)
      await queryRunner.rollbackTransaction()
      if (err instanceof BadRequestException) {
        throw err
      }
      throw new InternalServerErrorException('Failed to update requirements')
    } finally {
      await queryRunner.release()
    }
  }

  private async updateOrCreateRequirements(
    rule: Rule,
    requirementDtos: UpdateRequirementDto[],
    existingRequirements: Requirement[],
    parent: Requirement | null,
    queryRunner: QueryRunner
  ): Promise<Requirement[]> {
    if (!Array.isArray(requirementDtos)) {
      throw new BadRequestException('Invalid input: requirementDtos must be an array')
    }

    const updatedRequirements: Requirement[] = []

    for (const dto of requirementDtos) {
      let requirement = dto.id ? existingRequirements.find((r) => r.id === dto.id) : null

      if (requirement) {
        // Update existing requirement
        requirement.content = dto.content ?? requirement.content
        requirement.style = dto.style ?? requirement.style
        requirement.isConnector = dto.isConnector !== undefined ? dto.isConnector : requirement.isConnector
        requirement.order_index = dto.order_index ?? requirement.order_index
      } else {
        // Create new requirement
        requirement = this.requirementsRepository.create({
          content: dto.content,
          style: dto.style,
          isConnector: dto.isConnector,
          order_index: dto.order_index,
          rule,
          parent,
        })
      }

      this.logger.log(`Before saving, isConnector: ${requirement.isConnector}, dto.isConnector: ${dto.isConnector}`)
      const savedRequirement = await queryRunner.manager.save(requirement)
      this.logger.log(`After saving, isConnector: ${savedRequirement.isConnector}`)

      if (dto.children && dto.children.length > 0) {
        const children = await this.updateOrCreateRequirements(
          rule,
          dto.children,
          requirement.children || [],
          savedRequirement,
          queryRunner
        )
        savedRequirement.children = children
      }

      updatedRequirements.push(savedRequirement)
    }

    return updatedRequirements
  }
  private async deleteUnusedRequirements(
    existingRequirements: Requirement[],
    updateRequirementDtos: UpdateRequirementDto[],
    queryRunner: QueryRunner
  ): Promise<void> {
    const updatedIds = new Set(
      updateRequirementDtos.map((dto) => dto.id).filter((id) => id !== undefined)
    )
    const requirementsToDelete = existingRequirements.filter((req) => !updatedIds.has(req.id))

    if (requirementsToDelete.length > 0) {
      const idsToDelete = requirementsToDelete.map((req) => req.id)
      await queryRunner.manager.delete(Requirement, { id: In(idsToDelete) })
      this.logger.log(`Deleted requirements with IDs: ${idsToDelete.join(', ')}`)
    }
  }

  private async deleteRequirementRecursively(
    requirement: Requirement,
    queryRunner: QueryRunner
  ): Promise<void> {
    if (requirement.children && requirement.children.length > 0) {
      for (const child of requirement.children) {
        await this.deleteRequirementRecursively(child, queryRunner)
      }
    }
    await queryRunner.manager.remove(Requirement, requirement)
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
