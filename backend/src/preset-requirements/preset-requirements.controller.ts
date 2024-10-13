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
  ValidationPipe,
} from '@nestjs/common'
import { PresetRequirementsService } from './preset-requirements.service'
import { PresetRequirement } from './entities/preset-requirement.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import {
  CreatePresetRequirementDto,
  UpdatePresetRequirementDto,
} from './dto/preset-requirement.dto'

@Controller('preset-courses/:presetCourseId/preset-rules/:presetRuleId/preset-requirements')
@UseGuards(JwtAuthGuard)
export class PresetRequirementsController {
  private readonly logger = new Logger(PresetRequirementsController.name)

  constructor(private readonly presetRequirementsService: PresetRequirementsService) {}

  @Get()
  async findAllPresetRequirements(
    @Param('presetCourseId', ParseIntPipe) presetCourseId: number,
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number
  ): Promise<Omit<PresetRequirement, 'parentId'>[]> {
    this.logger.log(
      `Fetching all preset requirements for preset rule ${presetRuleId} in preset course ${presetCourseId}`
    )
    return this.presetRequirementsService.findAllPresetRequirements(presetCourseId, presetRuleId)
  }

  @Post()
  async createPresetRequirement(
    @Param('presetCourseId', ParseIntPipe) presetCourseId: number,
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number,
    @Body(new ValidationPipe({ whitelist: true }))
    createPresetRequirementDtos: CreatePresetRequirementDto[]
  ): Promise<PresetRequirement[]> {
    this.logger.log(
      `Receive createPresetRequirement request：${JSON.stringify(createPresetRequirementDtos)}`
    )
    return Promise.all(
      createPresetRequirementDtos.map((dto) =>
        this.presetRequirementsService.createPresetRequirement(presetCourseId, presetRuleId, dto)
      )
    )
  }

  @Put()
  async updatePresetRequirements(
    @Param('presetCourseId', ParseIntPipe) presetCourseId: number,
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number,
    @Body() updatePresetRequirementData: UpdatePresetRequirementDto | UpdatePresetRequirementDto[]
  ): Promise<PresetRequirement[]> {
    this.logger.log(
      `Updating preset requirements for preset rule ${presetRuleId} in preset course ${presetCourseId}`
    )
    const updatePresetRequirementDtos = Array.isArray(updatePresetRequirementData)
      ? updatePresetRequirementData
      : [updatePresetRequirementData]
    return this.presetRequirementsService.updatePresetRequirements(
      presetCourseId,
      presetRuleId,
      updatePresetRequirementDtos
    )
  }

  @Delete(':presetRequirementId')
  async removePresetRequirement(
    @Param('presetCourseId', ParseIntPipe) presetCourseId: number,
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number,
    @Param('presetRequirementId', ParseIntPipe) presetRequirementId: number
  ): Promise<void> {
    this.logger.log(
      `Removing preset requirement ${presetRequirementId} from preset rule ${presetRuleId} in preset course ${presetCourseId}`
    )
    await this.presetRequirementsService.removePresetRequirement(
      presetCourseId,
      presetRuleId,
      presetRequirementId
    )
  }

  @Post(':presetRequirementId/children')
  async addChildPresetRequirement(
    @Param('presetCourseId', ParseIntPipe) presetCourseId: number,
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number,
    @Param('presetRequirementId', ParseIntPipe) presetRequirementId: number,
    @Body() createPresetRequirementDto: CreatePresetRequirementDto
  ): Promise<PresetRequirement> {
    this.logger.log(
      `Adding child preset requirement for preset requirement ${presetRequirementId} in preset rule ${presetRuleId}`
    )
    return this.presetRequirementsService.addChildPresetRequirement(
      presetCourseId,
      presetRuleId,
      presetRequirementId,
      createPresetRequirementDto
    )
  }

  @Get(':presetRequirementId/children')
  async findChildrenPresetRequirements(
    @Param('presetCourseId', ParseIntPipe) presetCourseId: number,
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number,
    @Param('presetRequirementId', ParseIntPipe) presetRequirementId: number
  ): Promise<PresetRequirement[]> {
    this.logger.log(
      `Fetching children of preset requirement ${presetRequirementId} in preset rule ${presetRuleId}`
    )
    return this.presetRequirementsService.findChildrenPresetRequirements(
      presetCourseId,
      presetRuleId,
      presetRequirementId
    )
  }
}
