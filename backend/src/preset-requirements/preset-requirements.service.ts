import {
  Injectable,
  NotFoundException,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource, QueryRunner, In } from 'typeorm'
import { PresetRequirement } from './entities/preset-requirement.entity'
import { PresetRule } from '../preset-rules/entities/preset-rule.entity'
import {
  CreatePresetRequirementDto,
  UpdatePresetRequirementDto,
} from './dto/preset-requirement.dto'
import { NumberingStyle } from './entities/style.enum'
import { DeepPartial } from 'typeorm'

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

  async findAllPresetRequirements(
    presetCourseId: number,
    presetRuleId: number
  ): Promise<Omit<PresetRequirement, 'parentId'>[]> {
    const presetRule = await this.presetRulesRepository.findOne({
      where: { id: presetRuleId, presetCourse: { id: presetCourseId } },
    })

    if (!presetRule) {
      throw new NotFoundException(
        `Preset rule with ID ${presetRuleId} not found in preset course ${presetCourseId}`
      )
    }

    const allPresetRequirements = await this.presetRequirementsRepository.find({
      where: { presetRule: { id: presetRuleId } },
      order: { order_index: 'ASC' },
    })

    // Build a tree structure
    const presetRequirementMap = new Map<
      number,
      Omit<PresetRequirement, 'parentId'> & { children: Omit<PresetRequirement, 'parentId'>[] }
    >()
    const rootPresetRequirements: (Omit<PresetRequirement, 'parentId'> & {
      children: Omit<PresetRequirement, 'parentId'>[]
    })[] = []

    allPresetRequirements.forEach((req) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { parentId, ...reqWithoutParentId } = req
      presetRequirementMap.set(req.id, {
        ...reqWithoutParentId,
        is_connector: Boolean(reqWithoutParentId.is_connector),
        children: [],
      })
    })

    allPresetRequirements.forEach((req) => {
      const presetRequirement = presetRequirementMap.get(req.id)
      if (req.parentId) {
        const parentReq = presetRequirementMap.get(req.parentId)
        if (parentReq) {
          parentReq.children.push(presetRequirement)
        }
      } else {
        rootPresetRequirements.push(presetRequirement)
      }
    })

    return rootPresetRequirements
  }

  private async loadChildrenRecursively(
    presetRequirements: PresetRequirement[]
  ): Promise<PresetRequirement[]> {
    for (const presetRequirement of presetRequirements) {
      if (presetRequirement.children && presetRequirement.children.length > 0) {
        presetRequirement.children = await this.loadChildrenRecursively(presetRequirement.children)
      }
    }
    return presetRequirements.sort((a, b) => a.id - b.id)
  }

  async createPresetRequirement(
    presetCourseId: number,
    presetRuleId: number,
    createPresetRequirementDto: CreatePresetRequirementDto
  ): Promise<PresetRequirement> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const presetRule = await this.presetRulesRepository.findOne({
        where: { id: presetRuleId, presetCourse: { id: presetCourseId } },
      })
      if (!presetRule) {
        throw new NotFoundException(
          `Preset rule with ID "${presetRuleId}" not found in preset course "${presetCourseId}"`
        )
      }

      const { children, ...presetRequirementData } = createPresetRequirementDto
      const presetRequirement = this.presetRequirementsRepository.create({
        ...presetRequirementData,
        style: presetRequirementData.style as NumberingStyle,
        presetRule,
      } as DeepPartial<PresetRequirement>)

      this.logger.log(`Creating preset requirement: ${JSON.stringify(presetRequirement)}`)
      const savedPresetRequirement = await queryRunner.manager.save(presetRequirement)
      this.logger.log(`Saved preset requirement: ${JSON.stringify(savedPresetRequirement)}`)

      if (children && children.length > 0) {
        await this.createPresetChildren(savedPresetRequirement, children, queryRunner)
      }

      await queryRunner.commitTransaction()
      this.logger.log(
        `Created new preset requirement with ID ${savedPresetRequirement.id} for preset rule ${presetRuleId}`
      )

      return this.presetRequirementsRepository.findOne({
        where: { id: savedPresetRequirement.id },
        relations: ['children'],
      })
    } catch (err) {
      this.logger.error(
        `Failed to create preset requirement for preset rule ${presetRuleId}`,
        err.stack
      )
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException('Failed to create preset requirement')
    } finally {
      await queryRunner.release()
    }
  }

  private async createPresetChildren(
    parentPresetRequirement: PresetRequirement,
    children: CreatePresetRequirementDto[],
    queryRunner: QueryRunner
  ): Promise<void> {
    for (const childDto of children) {
      const { children: grandchildren, ...childData } = childDto
      const childPresetRequirement = this.presetRequirementsRepository.create({
        ...childData,
        style: childData.style as NumberingStyle,
        parentId: parentPresetRequirement.id,
        presetRule: parentPresetRequirement.presetRule,
      } as DeepPartial<PresetRequirement>)

      this.logger.log(
        `Creating child preset requirement: ${JSON.stringify(childPresetRequirement)}`
      )
      const savedChild = await queryRunner.manager.save(childPresetRequirement)
      this.logger.log(`Saved child preset requirement: ${JSON.stringify(savedChild)}`)

      if (grandchildren && grandchildren.length > 0) {
        await this.createPresetChildren(savedChild, grandchildren, queryRunner)
      }
    }
  }

  async updatePresetRequirements(
    presetCourseId: number,
    presetRuleId: number,
    updatePresetRequirementDtos: UpdatePresetRequirementDto | UpdatePresetRequirementDto[]
  ): Promise<PresetRequirement[]> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const presetRule = await this.presetRulesRepository.findOne({
        where: { id: presetRuleId, presetCourse: { id: presetCourseId } },
      })
      if (!presetRule) {
        throw new NotFoundException(
          `Preset rule with ID "${presetRuleId}" not found in preset course "${presetCourseId}"`
        )
      }

      // Ensure updatePresetRequirementDtos is an array
      const dtos = Array.isArray(updatePresetRequirementDtos)
        ? updatePresetRequirementDtos
        : [updatePresetRequirementDtos]

      // Fetch all existing preset requirements for this preset rule
      const existingPresetRequirements = await this.presetRequirementsRepository.find({
        where: { presetRule: { id: presetRuleId } },
        relations: ['children'],
      })

      // Update or create preset requirements
      const updatedPresetRequirements = await this.updateOrCreatePresetRequirements(
        presetRule,
        dtos,
        existingPresetRequirements,
        null,
        queryRunner
      )

      // Delete preset requirements that are no longer needed
      await this.deleteUnusedPresetRequirements(existingPresetRequirements, dtos, queryRunner)

      await queryRunner.commitTransaction()
      this.logger.log(`Updated preset requirements for preset rule ${presetRuleId}`)

      return updatedPresetRequirements
    } catch (err) {
      this.logger.error(
        `Failed to update preset requirements for preset rule ${presetRuleId}`,
        err.stack
      )
      await queryRunner.rollbackTransaction()
      if (err instanceof BadRequestException) {
        throw err
      }
      throw new InternalServerErrorException('Failed to update preset requirements')
    } finally {
      await queryRunner.release()
    }
  }

  private async updateOrCreatePresetRequirements(
    presetRule: PresetRule,
    presetRequirementDtos: UpdatePresetRequirementDto[],
    existingPresetRequirements: PresetRequirement[],
    parent: PresetRequirement | null,
    queryRunner: QueryRunner
  ): Promise<PresetRequirement[]> {
    if (!Array.isArray(presetRequirementDtos)) {
      throw new BadRequestException('Invalid input: presetRequirementDtos must be an array')
    }

    const updatedPresetRequirements: PresetRequirement[] = []

    for (const dto of presetRequirementDtos) {
      let presetRequirement = dto.id
        ? existingPresetRequirements.find((r) => r.id === dto.id)
        : null

      if (presetRequirement) {
        // Update existing preset requirement
        presetRequirement.content = dto.content ?? presetRequirement.content
        presetRequirement.style = (dto.style as NumberingStyle) ?? presetRequirement.style
        presetRequirement.is_connector = dto.is_connector ?? presetRequirement.is_connector
        presetRequirement.order_index = dto.order_index ?? presetRequirement.order_index
      } else {
        // Create new preset requirement
        const { id, children, ...presetRequirementData } = dto
        presetRequirement = this.presetRequirementsRepository.create({
          ...presetRequirementData,
          style: presetRequirementData.style as NumberingStyle,
          presetRule,
          parent,
        } as DeepPartial<PresetRequirement>)
      }

      this.logger.log(
        `Before saving, is_connector: ${presetRequirement.is_connector}, dto.is_connector: ${dto.is_connector}`
      )
      const savedPresetRequirement = await queryRunner.manager.save(presetRequirement)
      this.logger.log(`After saving, is_connector: ${savedPresetRequirement.is_connector}`)

      if (dto.children && dto.children.length > 0) {
        const children = await this.updateOrCreatePresetRequirements(
          presetRule,
          dto.children,
          presetRequirement.children || [],
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
    const presetRequirementsToDelete = existingPresetRequirements.filter(
      (req) => !updatedIds.has(req.id)
    )

    if (presetRequirementsToDelete.length > 0) {
      const idsToDelete = presetRequirementsToDelete.map((req) => req.id)
      await queryRunner.manager.delete(PresetRequirement, { id: In(idsToDelete) })
      this.logger.log(`Deleted preset requirements with IDs: ${idsToDelete.join(', ')}`)
    }
  }

  private async deletePresetRequirementRecursively(
    presetRequirement: PresetRequirement,
    queryRunner: QueryRunner
  ): Promise<void> {
    if (presetRequirement.children && presetRequirement.children.length > 0) {
      for (const child of presetRequirement.children) {
        await this.deletePresetRequirementRecursively(child, queryRunner)
      }
    }
    await queryRunner.manager.remove(PresetRequirement, presetRequirement)
  }

  async removePresetRequirement(
    presetCourseId: number,
    presetRuleId: number,
    presetRequirementId: number
  ): Promise<void> {
    const presetRequirement = await this.presetRequirementsRepository.findOne({
      where: {
        id: presetRequirementId,
        presetRule: { id: presetRuleId, presetCourse: { id: presetCourseId } },
      },
    })

    if (!presetRequirement) {
      throw new NotFoundException(`Preset requirement with ID "${presetRequirementId}" not found`)
    }

    await this.presetRequirementsRepository.remove(presetRequirement)
  }

  async addChildPresetRequirement(
    presetCourseId: number,
    presetRuleId: number,
    presetRequirementId: number,
    createPresetRequirementDto: CreatePresetRequirementDto
  ): Promise<PresetRequirement> {
    const parentPresetRequirement = await this.presetRequirementsRepository.findOne({
      where: {
        id: presetRequirementId,
        presetRule: { id: presetRuleId, presetCourse: { id: presetCourseId } },
      },
    })

    if (!parentPresetRequirement) {
      throw new NotFoundException(
        `Parent preset requirement with ID "${presetRequirementId}" not found`
      )
    }

    const childPresetRequirement = this.presetRequirementsRepository.create({
      ...createPresetRequirementDto,
      style: createPresetRequirementDto.style as NumberingStyle,
      parent: parentPresetRequirement,
      presetRule: parentPresetRequirement.presetRule,
    } as DeepPartial<PresetRequirement>)

    return this.presetRequirementsRepository.save(childPresetRequirement)
  }

  async findChildrenPresetRequirements(
    presetCourseId: number,
    presetRuleId: number,
    presetRequirementId: number
  ): Promise<PresetRequirement[]> {
    return this.presetRequirementsRepository.find({
      where: {
        parent: { id: presetRequirementId },
        presetRule: { id: presetRuleId, presetCourse: { id: presetCourseId } },
      },
      order: { order_index: 'ASC' },
    })
  }
}
