import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource, QueryRunner } from 'typeorm'
import { Requirement } from './entities/requirement.entity'
import { Rule } from '../rules/entities/rule.entity'
import { CreateRequirementDto, UpdateRequirementDto } from './dto/requirement.dto'
import { NumberingStyle } from './entities/style.enum'
import { DeepPartial } from 'typeorm'

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

  async findAllRequirements(
    courseId: number,
    ruleId: number
  ): Promise<Omit<Requirement, 'parentId'>[]> {
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
    const requirementMap = new Map<
      number,
      Omit<Requirement, 'parentId'> & { children: Omit<Requirement, 'parentId'>[] }
    >()
    const rootRequirements: (Omit<Requirement, 'parentId'> & {
      children: Omit<Requirement, 'parentId'>[]
    })[] = []

    allRequirements.forEach((req) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { parentId, ...reqWithoutParentId } = req
      requirementMap.set(req.id, {
        ...reqWithoutParentId,
        is_connector: Boolean(reqWithoutParentId.is_connector),
        children: [],
      })
    })

    allRequirements.forEach((req) => {
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

      const { children, ...requirementData } = createRequirementDto
      const requirement = this.requirementsRepository.create({
        ...requirementData,
        style: requirementData.style as NumberingStyle,
        rule,
      } as DeepPartial<Requirement>)

      this.logger.log(`Creating requirement: ${JSON.stringify(requirement)}`)
      const savedRequirement = await queryRunner.manager.save(requirement)
      this.logger.log(`Saved requirement: ${JSON.stringify(savedRequirement)}`)

      if (children && children.length > 0) {
        await this.createChildren(savedRequirement, children, queryRunner)
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
      const { children: grandchildren, ...childData } = childDto
      const childRequirement = this.requirementsRepository.create({
        ...childData,
        style: childData.style as NumberingStyle,
        parentId: parentRequirement.id,
        rule: parentRequirement.rule,
      } as DeepPartial<Requirement>)

      this.logger.log(`Creating child requirement: ${JSON.stringify(childRequirement)}`)
      const savedChild = await queryRunner.manager.save(childRequirement)
      this.logger.log(`Saved child requirement: ${JSON.stringify(savedChild)}`)

      if (grandchildren && grandchildren.length > 0) {
        await this.createChildren(savedChild, grandchildren, queryRunner)
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

      const dtos = Array.isArray(updateRequirementDtos)
        ? updateRequirementDtos
        : [updateRequirementDtos]

      const existingRequirements = await this.requirementsRepository.find({
        where: { rule: { id: ruleId } },
        relations: ['children'],
      })

      // First, create or update all requirements without setting parent relationships
      const updatedRequirements = await this.updateOrCreateRequirements(
        rule,
        dtos,
        existingRequirements,
        null,
        queryRunner
      )

      // Then, update parent relationships
      await this.updateParentRelationships(updatedRequirements, dtos, queryRunner)

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
        requirement.style = (dto.style as NumberingStyle) ?? requirement.style
        requirement.is_connector = dto.is_connector ?? requirement.is_connector
        requirement.order_index = dto.order_index ?? requirement.order_index
        // Don't set parent here
      } else {
        // Create new requirement
        const { ...requirementData } = dto
        requirement = this.requirementsRepository.create({
          ...requirementData,
          style: requirementData.style as NumberingStyle,
          rule,
          // Don't set parent here
        } as DeepPartial<Requirement>)
      }

      const savedRequirement = await queryRunner.manager.save(requirement)

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

  private async updateParentRelationships(
    updatedRequirements: Requirement[],
    dtos: UpdateRequirementDto[],
    queryRunner: QueryRunner
  ): Promise<void> {
    const requirementMap = new Map<number, Requirement>()
    updatedRequirements.forEach((req) => requirementMap.set(req.id, req))

    this.logger.log(`Updating parent relationships for ${dtos.length} requirements`)

    for (const dto of dtos) {
      this.logger.log(`Processing DTO: ${JSON.stringify(dto)}`)

      if (dto.id) {
        const requirement = requirementMap.get(dto.id)
        if (requirement) {
          this.logger.log(`Found requirement with id ${dto.id}`)

          // Check if the DTO has a parent property instead of parentId
          if ('parent' in dto && dto.parent) {
            const parentId = typeof dto.parent === 'number' ? dto.parent : dto.parent.id
            this.logger.log(`Attempting to set parent with id ${parentId}`)

            const parent = requirementMap.get(parentId)
            if (parent) {
              requirement.parent = parent
              this.logger.log(`Set parent for requirement ${dto.id} to ${parentId}`)
              await queryRunner.manager.save(requirement)
            } else {
              this.logger.warn(`Parent with id ${parentId} not found`)
            }
          } else {
            requirement.parent = null
            this.logger.log(`Removed parent for requirement ${dto.id}`)
            await queryRunner.manager.save(requirement)
          }
        } else {
          this.logger.warn(`Requirement with id ${dto.id} not found in the map`)
        }
      } else {
        this.logger.warn(`DTO does not have an id: ${JSON.stringify(dto)}`)
      }

      if (dto.children && dto.children.length > 0) {
        this.logger.log(`Processing ${dto.children.length} children for requirement ${dto.id}`)
        await this.updateParentRelationships(updatedRequirements, dto.children, queryRunner)
      }
    }
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

    for (const requirement of requirementsToDelete) {
      await queryRunner.manager.remove(Requirement, requirement)
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
      style: createRequirementDto.style as NumberingStyle,
      parent: parentRequirement,
      rule: parentRequirement.rule,
    } as DeepPartial<Requirement>)

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
