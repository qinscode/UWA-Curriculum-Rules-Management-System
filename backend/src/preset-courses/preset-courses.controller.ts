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
  PipeTransform,
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { PresetCoursesService } from './preset-courses.service'
import { PresetCourse } from './entities/preset-course.entity'
import { CreatePresetCourseDto, UpdatePresetCourseDto } from './dto/'
import { PresetRule } from '../preset-rules/entities/preset-rule.entity'
import { CreatePresetRuleDto, UpdatePresetRuleDto } from '../preset-rules/dto/preset-rule.dto'
import { PresetRuleType } from '../preset-rules/entities/preset-rule.enum'
import { PresetCourseType } from './entities/preset-course-type.enum'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { UserType } from '../users/entities/user.enum'

@Injectable()
class ParsePresetCourseTypePipe implements PipeTransform<string, PresetCourseType> {
  transform(value: string): PresetCourseType {
    const decodedValue = decodeURIComponent(value).replace(/^['"]|['"]$/g, '')
    const courseType = Object.values(PresetCourseType).find(
      (type) => type.toLowerCase() === decodedValue.toLowerCase()
    )
    if (!courseType) {
      throw new Error(`Invalid PresetCourseType: ${value}`)
    }
    return courseType
  }
}

@Controller('preset-courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PresetCoursesController {
  private readonly logger = new Logger(PresetCoursesController.name)

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
    this.logger.log(`Received create request with data: ${JSON.stringify(createPresetCourseDto)}`)

    try {
      this.logger.log('Validating DTO...')
      this.logger.log('Calling presetCoursesService.create...')
      const createdCourse = await this.presetCoursesService.create(createPresetCourseDto)

      this.logger.log(`Successfully created preset course with ID: ${createdCourse.id}`)
      return createdCourse
    } catch (error) {
      this.logger.error(`Failed to create preset course: ${error.message}`, error.stack)
      throw error
    }
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
    this.logger.log(`Received request to delete preset course with ID: ${id}`)

    try {
      this.logger.log('Calling presetCoursesService.remove...')
      await this.presetCoursesService.remove(id)
      this.logger.log(`Successfully processed delete request for preset course with ID: ${id}`)
    } catch (error) {
      this.logger.error(
        `Error while processing delete request for preset course with ID ${id}: ${error.message}`,
        error.stack
      )

      if (error instanceof NotFoundException) {
        throw error
      }

      throw new InternalServerErrorException('An error occurred while deleting the preset course')
    }
  }

  // PresetRule-related endpoints

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
  @Roles(UserType.ADMIN)
  @UseGuards(RolesGuard)
  async removePresetRule(
    @Param('id', ParseIntPipe) id: number,
    @Param('presetRuleId', ParseIntPipe) presetRuleId: number
  ): Promise<void> {
    this.logger.log(
      `Received request to delete preset rule with ID: ${presetRuleId} from preset course with ID: ${id}`
    )

    try {
      this.logger.log('Calling presetCoursesService.removePresetRule...')
      await this.presetCoursesService.removePresetRule(id, presetRuleId)
      this.logger.log(
        `Successfully processed delete request for preset rule with ID: ${presetRuleId} from preset course with ID: ${id}`
      )
    } catch (error) {
      this.logger.error(
        `Error while processing delete request for preset rule with ID ${presetRuleId} from preset course with ID ${id}: ${error.message}`,
        error.stack
      )
      throw error
    }
  }

  @Delete(':id/preset-rules/by-type/:type')
  async removePresetRuleByType(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: PresetRuleType
  ): Promise<void> {
    await this.presetCoursesService.removePresetRuleByType(id, type)
  }

  @Get('by-type/:type/preset-rules')
  async findPresetRulesByType(
    @Param('type', ParsePresetCourseTypePipe) type: PresetCourseType
  ): Promise<PresetRule[]> {
    this.logger.log(`Received request for preset rules of course type: ${type}`)

    const presetRules = await this.presetCoursesService.findPresetRulesByType(type)

    this.logger.log(`Found ${presetRules.length} preset rules for course type: ${type}`)

    if (presetRules.length === 0) {
      const message = `No preset rules found for course type: ${type}. This could be because no course of this type exists, or because the course has no associated rules.`
      this.logger.warn(message)
    }

    return presetRules
  }
}
