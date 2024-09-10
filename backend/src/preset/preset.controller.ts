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
  NotFoundException,
} from '@nestjs/common'
import { PresetsService } from './preset.service'
import { Preset } from './entities/preset.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import {
  CreatePresetDto,
  UpdatePresetDto,
  PresetWithHierarchyDto,
  RequirementHierarchyDto,
} from './dto/rule.dto'
import { PresetType } from './entities/preset.enum'
import { Requirement } from '../requirements/entities/requirement.entity'

@Controller('courses/:courseId/preset')
@UseGuards(JwtAuthGuard)
export class PresetsController {
  private readonly logger = new Logger(PresetsController.name)

  constructor(private readonly presetService: PresetsService) {}

  @Get()
  async findAllPresets(
    @Param('courseId', ParseIntPipe) courseId: number
  ): Promise<PresetWithHierarchyDto[]> {
    const preset = await this.presetService.findAllPresets(courseId)
    const presetWithHierarchy: PresetWithHierarchyDto[] = []

    for (const rule of preset) {
      const requirements = await this.presetService.findPresetRequirementsHierarchy(rule.id)
      presetWithHierarchy.push({
        ...rule,
        requirements: this.mapRequirementsToDto(requirements.filter((req) => !req.parentId)),
      })
    }

    return presetWithHierarchy
  }

  private mapRequirementsToDto(requirements: Requirement[]): RequirementHierarchyDto[] {
    return requirements.map((req) => ({
      id: req.id,
      content: req.content,
      style: req.style,
      is_connector: req.isConnector, // Map isConnector to is_connector
      order_index: req.order_index,
      children: req.children ? this.mapRequirementsToDto(req.children) : [],
    }))
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Preset> {
    this.logger.log(`Fetching rule ${id}`)
    const rule = await this.presetService.findOne(id)
    if (!rule) {
      throw new NotFoundException(`Preset with ID "${id}" not found`)
    }
    return rule
  }

  @Get('by-type/:type')
  async findByType(@Param('type') type: PresetType): Promise<Preset[]> {
    this.logger.log(`Fetching preset with type ${type}`)
    return this.presetService.findByType(type)
  }

  @Post()
  async create(@Body() createPresetDto: CreatePresetDto): Promise<Preset> {
    this.logger.log('Creating new rule')
    return this.presetService.create(createPresetDto)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePresetDto: UpdatePresetDto
  ): Promise<Preset> {
    this.logger.log(`Updating rule ${id}`)
    const updatedPreset = await this.presetService.update(id, updatePresetDto)
    if (!updatedPreset) {
      throw new NotFoundException(`Preset with ID "${id}" not found`)
    }
    return updatedPreset
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Removing rule ${id}`)
    await this.presetService.remove(id)
  }
}
