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
import { PresetRulesService } from './preset-rules.service'
import { PresetRule } from './entities/preset-rule.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import {
  CreatePresetRuleDto,
  UpdatePresetRuleDto,
  PresetRuleWithHierarchyDto,
  PresetRequirementHierarchyDto,
} from './dto/preset-rule.dto'
import { PresetRuleType } from './entities/preset-rule.enum'
import { PresetRequirement } from '../preset-requirements/entities/preset-requirement.entity'

@Controller('preset-rules')
@UseGuards(JwtAuthGuard)
export class PresetRulesController {
  private readonly logger = new Logger(PresetRulesController.name)

  constructor(private readonly presetRulesService: PresetRulesService) {}

  @Get()
  async findAllPresetRules(): Promise<PresetRuleWithHierarchyDto[]> {
    const presetRules = await this.presetRulesService.findAllPresetRules()
    const presetRulesWithHierarchy: PresetRuleWithHierarchyDto[] = []

    for (const presetRule of presetRules) {
      const presetRequirements = await this.presetRulesService.findPresetRuleRequirementsHierarchy(
        presetRule.id
      )
      presetRulesWithHierarchy.push({
        ...presetRule,
        presetRequirements: this.mapPresetRequirementsToDto(
          presetRequirements.filter((req) => !req.parentId)
        ),
      })
    }

    return presetRulesWithHierarchy
  }

  private mapPresetRequirementsToDto(
    presetRequirements: PresetRequirement[]
  ): PresetRequirementHierarchyDto[] {
    return presetRequirements.map((req) => ({
      id: req.id,
      content: req.content,
      style: req.style,
      is_connector: req.isConnector,
      order_index: req.order_index,
      children: req.children ? this.mapPresetRequirementsToDto(req.children) : [],
    }))
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PresetRule> {
    this.logger.log(`Fetching preset rule ${id}`)
    const presetRule = await this.presetRulesService.findOne(id)
    if (!presetRule) {
      throw new NotFoundException(`Preset Rule with ID "${id}" not found`)
    }
    return presetRule
  }

  @Get('by-type/:type')
  async findByType(@Param('type') type: PresetRuleType): Promise<PresetRule[]> {
    this.logger.log(`Fetching preset rules with type ${type}`)
    return this.presetRulesService.findByType(type)
  }

  @Post()
  async create(@Body() createPresetRuleDto: CreatePresetRuleDto): Promise<PresetRule> {
    this.logger.log('Creating new preset rule')
    return this.presetRulesService.create(createPresetRuleDto)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePresetRuleDto: UpdatePresetRuleDto
  ): Promise<PresetRule> {
    this.logger.log(`Updating preset rule ${id}`)
    const updatedPresetRule = await this.presetRulesService.update(id, updatePresetRuleDto)
    if (!updatedPresetRule) {
      throw new NotFoundException(`Preset Rule with ID "${id}" not found`)
    }
    return updatedPresetRule
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Removing preset rule ${id}`)
    await this.presetRulesService.remove(id)
  }
}
