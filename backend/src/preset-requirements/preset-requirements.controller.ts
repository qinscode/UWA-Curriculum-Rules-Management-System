import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
  Logger,
} from '@nestjs/common'
import { PresetRequirementsService } from './preset-requirements.service'
import { PresetRequirement } from './entities/preset-requirement.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import {
  CreatePresetRequirementDto,
  UpdatePresetRequirementDto,
} from './dto/preset-requirement.dto'

@Controller('/preset-rules/:presetRuleId/preset-requirements')
@UseGuards(JwtAuthGuard)
export class PresetRequirementsController {
  private readonly logger = new Logger(PresetRequirementsController.name)

  constructor(private readonly presetRequirementsService: PresetRequirementsService) {}

  @Get()
  async findAllPresetRequirements(
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number
  ): Promise<Omit<PresetRequirement, 'parentId'>[]> {
    this.logger.log(`Fetching all preset requirements for preset rule ${presetRuleId}`)
    return this.presetRequirementsService.findAllPresetRequirements(presetRuleId)
  }

  @Post()
  async createPresetRequirement(
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number,
    @Body() createPresetRequirementDtos: CreatePresetRequirementDto[]
  ): Promise<PresetRequirement[]> {
    this.logger.log(
      `Receive createPresetRequirement request: ${JSON.stringify(createPresetRequirementDtos)}`
    )
    return Promise.all(
      createPresetRequirementDtos.map((dto) =>
        this.presetRequirementsService.createPresetRequirement(presetRuleId, dto)
      )
    )
  }

  @Put()
  async updatePresetRequirements(
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number,
    @Body() updatePresetRequirementData: UpdatePresetRequirementDto | UpdatePresetRequirementDto[]
  ): Promise<PresetRequirement[]> {
    this.logger.log(`Updating preset requirements for preset rule ${presetRuleId}`)
    const updatePresetRequirementDtos = Array.isArray(updatePresetRequirementData)
      ? updatePresetRequirementData
      : [updatePresetRequirementData]
    return this.presetRequirementsService.updatePresetRequirements(
      presetRuleId,
      updatePresetRequirementDtos
    )
  }

  @Delete(':presetRequirementId')
  async removePresetRequirement(
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number,
    @Param('presetRequirementId', ParseIntPipe) presetRequirementId: number
  ): Promise<void> {
    this.logger.log(
      `Removing preset requirement ${presetRequirementId} from preset rule ${presetRuleId}`
    )
    await this.presetRequirementsService.removePresetRequirement(presetRuleId, presetRequirementId)
  }

  @Post(':presetRequirementId/children')
  async addChildPresetRequirement(
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number,
    @Param('presetRequirementId', ParseIntPipe) presetRequirementId: number,
    @Body() createPresetRequirementDto: CreatePresetRequirementDto
  ): Promise<PresetRequirement> {
    this.logger.log(
      `Adding child preset requirement for preset requirement ${presetRequirementId} in preset rule ${presetRuleId}`
    )
    return this.presetRequirementsService.addChildPresetRequirement(
      presetRuleId,
      presetRequirementId,
      createPresetRequirementDto
    )
  }

  @Get(':presetRequirementId/children')
  async findChildren(
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number,
    @Param('presetRequirementId', ParseIntPipe) presetRequirementId: number
  ): Promise<PresetRequirement[]> {
    this.logger.log(
      `Fetching children of preset requirement ${presetRequirementId} in preset rule ${presetRuleId}`
    )
    return this.presetRequirementsService.findChildren(presetRuleId, presetRequirementId)
  }
}
