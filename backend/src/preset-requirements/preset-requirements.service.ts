import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource, QueryRunner, In } from 'typeorm'
import { NumberingStyle } from './entities/style.enum'
import { DeepPartial } from 'typeorm'
import { PresetRequirement } from './entities/preset-requirement.entity'
import { PresetRule } from '../preset-rules/entities/preset-rule.entity'
import {
  CreatePresetRequirementDto,
  UpdatePresetRequirementDto,
} from './dto/preset-requirement.dto'

@Injectable()
export class PresetRequirementsService {
  private readonly logger = new Logger(PresetRequirementsService.name)

  constructor(
    @InjectRepository(PresetRequirement)
    private presetRequirementsRepository: Repository<PresetRequirement>,
    @InjectRepository(PresetRule)
    private presetRulesRepository: Repository<PresetRule>,
    private dataSource: DataSource
  ) {}

  async findAllRequirements(
    courseId: number,
    ruleId: number
  ): Promise<Omit<PresetRequirement, 'parentId'>[]> {
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
      Omit<PresetRequirement, 'parentId'> & { children: Omit<PresetRequirement, 'parentId'>[] }
    >()
    const rootRequirements: (Omit<PresetRequirement, 'parentId'> & {
      children: Omit<PresetRequirement, 'parentId'>[]
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

  private async loadChildrenRecursively(
    requirements: PresetRequirement[]
  ): Promise<PresetRequirement[]> {
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
    createRequirementDto: CreatePresetRequirementDto
  ): Promise<PresetRequirement> {
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
      } as DeepPartial<PresetRequirement>)

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
    parentRequirement: PresetRequirement,
    children: CreatePresetRequirementDto[],
    queryRunner: QueryRunner
  ): Promise<void> {
    for (const childDto of children) {
      const { children: grandchildren, ...childData } = childDto
      const childRequirement = this.requirementsRepository.create({
        ...childData,
        style: childData.style as NumberingStyle,
        parentId: parentRequirement.id,
        rule: parentRequirement.rule,
      } as DeepPartial<PresetRequirement>)

      this.logger.log(`Creating child requirement: ${JSON.stringify(childRequirement)}`)
      const savedChild = await queryRunner.manager.save(childRequirement)
      this.logger.log(`Saved child requirement: ${JSON.stringify(savedChild)}`)

      if (grandchildren && grandchildren.length > 0) {
        await this.createChildren(savedChild, grandchildren, queryRunner)
      }
    }
  }

  async updatePresetRequirements(
    courseId: number,
    ruleId: number,
    updatePresetRequirementDtos: UpdatePresetRequirementDto | UpdatePresetRequirementDto[]
  ): Promise<PresetRequirement[]> {
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
      const dtos = Array.isArray(updatePresetRequirementDtos)
        ? updatePresetRequirementDtos
        : [updatePresetRequirementDtos]

      // Fetch all existing requirements for this rule
      const existingRequirements = await this.requirementsRepository.find({
        where: { rule: { id: ruleId } },
        relations: ['children'],
      })

      // Update or create requirements
      const updatedRequirements = await this.updateOrCreatePresetRequirements(
        rule,
        dtos,
        existingRequirements,
        null,
        queryRunner
      )

      // Delete requirements that are no longer needed
      await this.deleteUnusedPresetRequirements(existingRequirements, dtos, queryRunner)

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

  private async updateOrCreatePresetRequirements(
    rule: PresetRule,
    requirementDtos: UpdatePresetRequirementDto[],
    existingPresetRequirements: PresetRequirement[],
    parent: PresetRequirement | null,
    queryRunner: QueryRunner
  ): Promise<PresetRequirement[]> {
    if (!Array.isArray(requirementDtos)) {
      throw new BadRequestException('Invalid input: PresetRequirementDtos must be an array')
    }

    const updatedPresetRequirements: PresetRequirement[] = []

    for (const dto of requirementDtos) {
      let PresetRequirement = dto.id
        ? existingPresetRequirements.find((r) => r.id === dto.id)
        : null

      if (PresetRequirement) {
        // Update existing PresetRequirement
        PresetRequirement.content = dto.content ?? PresetRequirement.content
        PresetRequirement.style = (dto.style as NumberingStyle) ?? PresetRequirement.style
        PresetRequirement.is_connector = dto.is_connector ?? PresetRequirement.is_connector
        PresetRequirement.order_index = dto.order_index ?? PresetRequirement.order_index
      } else {
        // Create new PresetRequirement
        const { id, children, ...PresetRequirementData } = dto
        PresetRequirement = this.PresetRequirementsRepository.create({
          ...PresetRequirementData,
          style: PresetRequirementData.style as NumberingStyle,
          rule,
          parent,
        } as DeepPartial<PresetRequirement>)
      }

      this.logger.log(
        `Before saving, is_connector: ${PresetRequirement.is_connector}, dto.is_connector: ${dto.is_connector}`
      )
      const savedPresetRequirement = await queryRunner.manager.save(PresetRequirement)
      this.logger.log(`After saving, is_connector: ${savedPresetRequirement.is_connector}`)

      if (dto.children && dto.children.length > 0) {
        const children = await this.updateOrCreatePresetRequirements(
          rule,
          dto.children,
          PresetRequirement.children || [],
          savedPresetRequirement,
          queryRunner
        )
        savedPresetRequirement.children = children
      }

      updatedPresetRequirements.push(savedPresetRequirement)
    }

    return updatedPresetRequirements
  }
  private async deleteUnusedPresetRequirements(
    existingPresetRequirements: PresetRequirement[],
    updatePresetRequirementDtos: UpdatePresetRequirementDto[],
    queryRunner: QueryRunner
  ): Promise<void> {
    const updatedIds = new Set(
      updatePresetRequirementDtos.map((dto) => dto.id).filter((id) => id !== undefined)
    )
    const PresetRequirementsToDelete = existingPresetRequirements.filter(
      (req) => !updatedIds.has(req.id)
    )

    if (PresetRequirementsToDelete.length > 0) {
      const idsToDelete = PresetRequirementsToDelete.map((req) => req.id)
      await queryRunner.manager.delete(PresetRequirement, { id: In(idsToDelete) })
      this.logger.log(`Deleted PresetRequirements with IDs: ${idsToDelete.join(', ')}`)
    }
  }

  private async deleteRequirementRecursively(
    requirement: PresetRequirement,
    queryRunner: QueryRunner
  ): Promise<void> {
    if (requirement.children && requirement.children.length > 0) {
      for (const child of requirement.children) {
        await this.deleteRequirementRecursively(child, queryRunner)
      }
    }
    await queryRunner.manager.remove(PresetRequirement, requirement)
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
    createRequirementDto: CreatePresetRequirementDto
  ): Promise<PresetRequirement> {
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
    } as DeepPartial<PresetRequirement>)

    return this.requirementsRepository.save(childRequirement)
  }

  async findChildren(
    courseId: number,
    ruleId: number,
    requirementId: number
  ): Promise<PresetRequirement[]> {
    return this.requirementsRepository.find({
      where: { parent: { id: requirementId }, rule: { id: ruleId, course: { id: courseId } } },
      order: { order_index: 'ASC' },
    })
  }
}
