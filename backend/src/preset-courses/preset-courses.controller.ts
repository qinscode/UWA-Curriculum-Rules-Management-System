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
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { PresetCoursesService } from './preset-courses.service'
import { PresetCourse } from './entities/preset-course.entity'
import { CreatePresetCourseDto, UpdatePresetCourseDto } from './dto/preset-course.dto'
import { PresetRule } from '../preset-rules/entities/preset-rule.entity'
import { CreatePresetRuleDto, UpdatePresetRuleDto } from '../preset-rules/dto/preset-rule.dto'
import { PresetRuleType } from '../preset-rules/entities/preset-rule.enum'

@Controller('preset-courses')
@UseGuards(JwtAuthGuard)
export class PresetCoursesController {
  constructor(private readonly presetCoursesService: PresetCoursesService) {}

  @Get()
  async findAll(): Promise<PresetCourse[]> {
    return this.presetCoursesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<PresetCourse> {
    const presetCourse = await this.presetCoursesService.findOne(id)
    if (!presetCourse) {
      throw new NotFoundException(`Preset course with ID "${id}" not found`)
    }
    return presetCourse
  }

  @Get('code/:code/version/:version')
  findByCodeAndVersion(
    @Param('code') code: string,
    @Param('version') version: string
  ): Promise<PresetCourse> {
    return this.presetCoursesService.findByCodeAndVersion(code, version)
  }

  @Post()
  async create(
    @Body(ValidationPipe) createPresetCourseDto: CreatePresetCourseDto
  ): Promise<PresetCourse> {
    return this.presetCoursesService.create(createPresetCourseDto)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updatePresetCourseDto: UpdatePresetCourseDto
  ): Promise<PresetCourse> {
    const updatedPresetCourse = await this.presetCoursesService.update(id, updatePresetCourseDto)
    if (!updatedPresetCourse) {
      throw new NotFoundException(`Preset course with ID "${id}" not found`)
    }
    return updatedPresetCourse
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.presetCoursesService.remove(id)
  }

  // PresetRule-related endpoints

  @Get(':id/preset-rules')
  async findAllPresetRules(@Param('id', ParseIntPipe) id: number): Promise<PresetRule[]> {
    console.log('Fetching all preset rules')
    return this.presetCoursesService.findAllPresetRules(id)
  }

  @Get(':id/preset-rules/:presetRuleId')
  async findOnePresetRule(
    @Param('id', ParseIntPipe) id: number,
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number
  ): Promise<PresetRule> {
    const presetRule = await this.presetCoursesService.findOnePresetRule(id, presetRuleId)
    if (!presetRule) {
      throw new NotFoundException(
        `Preset rule with ID "${presetRuleId}" not found in preset course "${id}"`
      )
    }
    return presetRule
  }

  @Get(':id/preset-rules/by-type/:type')
  async findPresetRuleByType(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: PresetRuleType
  ): Promise<PresetRule> {
    const presetRule = await this.presetCoursesService.findPresetRuleByType(id, type)
    if (!presetRule) {
      throw new NotFoundException(
        `Preset rule with type "${type}" not found in preset course "${id}"`
      )
    }
    return presetRule
  }

  @Post(':id/preset-rules')
  async createPresetRule(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) createPresetRuleDto: CreatePresetRuleDto
  ): Promise<PresetRule> {
    return this.presetCoursesService.createPresetRule(id, createPresetRuleDto)
  }

  @Put(':id/preset-rules/:presetRuleId')
  async updatePresetRule(
    @Param('id', ParseIntPipe) id: number,
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number,
    @Body(ValidationPipe) updatePresetRuleDto: UpdatePresetRuleDto
  ): Promise<PresetRule> {
    const updatedPresetRule = await this.presetCoursesService.updatePresetRule(
      id,
      presetRuleId,
      updatePresetRuleDto
    )
    if (!updatedPresetRule) {
      throw new NotFoundException(
        `Preset rule with ID "${presetRuleId}" not found in preset course "${id}"`
      )
    }
    return updatedPresetRule
  }

  @Put(':id/preset-rules/by-type/:type')
  async updatePresetRuleByType(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: PresetRuleType,
    @Body(ValidationPipe) updatePresetRuleDto: UpdatePresetRuleDto
  ): Promise<PresetRule> {
    const updatedPresetRule = await this.presetCoursesService.updatePresetRuleByType(
      id,
      type,
      updatePresetRuleDto
    )
    if (!updatedPresetRule) {
      throw new NotFoundException(
        `Preset rule with type "${type}" not found in preset course "${id}"`
      )
    }
    return updatedPresetRule
  }

  @Delete(':id/preset-rules/:presetRuleId')
  async removePresetRule(
    @Param('id', ParseIntPipe) id: number,
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number
  ): Promise<void> {
    await this.presetCoursesService.removePresetRule(id, presetRuleId)
  }

  @Delete(':id/preset-rules/by-type/:type')
  async removePresetRuleByType(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: PresetRuleType
  ): Promise<void> {
    await this.presetCoursesService.removePresetRuleByType(id, type)
  }
}
