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
    presetRuleId: number
  ): Promise<Omit<PresetRequirement, 'parentId'>[]> {
    const presetRule = await this.presetRulesRepository.findOne({
      where: { id: presetRuleId },
    })

    if (!presetRule) {
      throw new NotFoundException(`PresetRule with ID ${presetRuleId} not found`)
    }

    const allPresetRequirements = await this.presetRequirementsRepository.find({
      where: { presetRule: { id: presetRuleId } },
      order: { order_index: 'ASC' },
    })

    const presetRequirementMap = new Map<
      number,
      Omit<PresetRequirement, 'parentId'> & { children: Omit<PresetRequirement, 'parentId'>[] }
    >()
    const rootPresetRequirements: (Omit<PresetRequirement, 'parentId'> & {
      children: Omit<PresetRequirement, 'parentId'>[]
    })[] = []

    allPresetRequirements.forEach((req) => {
      const { parentId, ...reqWithoutParentId } = req
      presetRequirementMap.set(req.id, {
        ...reqWithoutParentId,
        isConnector: Boolean(reqWithoutParentId.isConnector),
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

  async createPresetRequirement(
    presetRuleId: number,
    createPresetRequirementDto: CreatePresetRequirementDto
  ): Promise<PresetRequirement> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const presetRule = await this.presetRulesRepository.findOne({
        where: { id: presetRuleId },
      })
      if (!presetRule) {
        throw new NotFoundException(`PresetRule with ID "${presetRuleId}" not found`)
      }

      const presetRequirement = this.presetRequirementsRepository.create({
        content: createPresetRequirementDto.content,
        style: createPresetRequirementDto.style,
        isConnector: Boolean(createPresetRequirementDto.isConnector),
        order_index: createPresetRequirementDto.order_index,
        presetRule,
      })

      this.logger.log(`Creating preset requirement: ${JSON.stringify(presetRequirement)}`)
      const savedPresetRequirement = await queryRunner.manager.save(presetRequirement)
      this.logger.log(`Saved preset requirement: ${JSON.stringify(savedPresetRequirement)}`)

      if (createPresetRequirementDto.children && createPresetRequirementDto.children.length > 0) {
        await this.createChildren(
          savedPresetRequirement,
          createPresetRequirementDto.children,
          queryRunner
        )
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

  private async createChildren(
    parentPresetRequirement: PresetRequirement,
    children: CreatePresetRequirementDto[],
    queryRunner: QueryRunner
  ): Promise<void> {
    for (const childDto of children) {
      const childPresetRequirement = this.presetRequirementsRepository.create({
        content: childDto.content,
        style: childDto.style,
        isConnector: childDto.isConnector,
        order_index: childDto.order_index,
        parentId: parentPresetRequirement.id,
        presetRule: parentPresetRequirement.presetRule,
      })

      this.logger.log(
        `Creating child preset requirement: ${JSON.stringify(childPresetRequirement)}`
      )
      const savedChild = await queryRunner.manager.save(childPresetRequirement)
      this.logger.log(`Saved child preset requirement: ${JSON.stringify(savedChild)}`)

      if (childDto.children && childDto.children.length > 0) {
        await this.createChildren(savedChild, childDto.children, queryRunner)
      }
    }
  }

  async updatePresetRequirements(
    presetRuleId: number,
    updatePresetRequirementDtos: UpdatePresetRequirementDto[]
  ): Promise<PresetRequirement[]> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const presetRule = await this.presetRulesRepository.findOne({
        where: { id: presetRuleId },
      })
      if (!presetRule) {
        throw new NotFoundException(`PresetRule with ID "${presetRuleId}" not found`)
      }

      const existingPresetRequirements = await this.presetRequirementsRepository.find({
        where: { presetRule: { id: presetRuleId } },
        relations: ['children'],
      })

      const updatedPresetRequirements = await this.updateOrCreatePresetRequirements(
        presetRule,
        updatePresetRequirementDtos,
        existingPresetRequirements,
        null,
        queryRunner
      )

      await this.deleteUnusedPresetRequirements(
        existingPresetRequirements,
        updatePresetRequirementDtos,
        queryRunner
      )

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
    const updatedPresetRequirements: PresetRequirement[] = []

    for (const dto of presetRequirementDtos) {
      let presetRequirement = dto.id
        ? existingPresetRequirements.find((r) => r.id === dto.id)
        : null

      if (presetRequirement) {
        presetRequirement.content = dto.content ?? presetRequirement.content
        presetRequirement.style = dto.style ?? presetRequirement.style
        presetRequirement.isConnector =
          dto.isConnector !== undefined ? dto.isConnector : presetRequirement.isConnector
        presetRequirement.order_index = dto.order_index ?? presetRequirement.order_index
      } else {
        presetRequirement = this.presetRequirementsRepository.create({
          content: dto.content,
          style: dto.style,
          isConnector: dto.isConnector,
          order_index: dto.order_index,
          presetRule,
          parent,
        })
      }

      const savedPresetRequirement = await queryRunner.manager.save(presetRequirement)

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

  async removePresetRequirement(presetRuleId: number, presetRequirementId: number): Promise<void> {
    const presetRequirement = await this.presetRequirementsRepository.findOne({
      where: { id: presetRequirementId, presetRule: { id: presetRuleId } },
    })

    if (!presetRequirement) {
      throw new NotFoundException(`PresetRequirement with ID "${presetRequirementId}" not found`)
    }

    await this.presetRequirementsRepository.remove(presetRequirement)
  }

  async addChildPresetRequirement(
    presetRuleId: number,
    presetRequirementId: number,
    createPresetRequirementDto: CreatePresetRequirementDto
  ): Promise<PresetRequirement> {
    const parentPresetRequirement = await this.presetRequirementsRepository.findOne({
      where: { id: presetRequirementId, presetRule: { id: presetRuleId } },
    })

    if (!parentPresetRequirement) {
      throw new NotFoundException(
        `Parent preset requirement with ID "${presetRequirementId}" not found`
      )
    }

    const childPresetRequirement = this.presetRequirementsRepository.create({
      ...createPresetRequirementDto,
      parent: parentPresetRequirement,
      presetRule: parentPresetRequirement.presetRule,
    })

    return this.presetRequirementsRepository.save(childPresetRequirement)
  }

  async findChildren(
    presetRuleId: number,
    presetRequirementId: number
  ): Promise<PresetRequirement[]> {
    return this.presetRequirementsRepository.find({
      where: { parent: { id: presetRequirementId }, presetRule: { id: presetRuleId } },
      order: { order_index: 'ASC' },
    })
  }
}
