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
import { Course } from './entities/preset-course.entity'
import { CreatePresetCourseDto, UpdatePresetCourseDto } from './dto/'
import { Rule } from '../rules/entities/rule.entity'
import { CreateRuleDto, UpdateRuleDto } from '../rules/dto/rule.dto'
import { RuleType } from '../rules/entities/rule.enum'

@Controller('preset-courses')
@UseGuards(JwtAuthGuard)
export class PresetCoursesController {
  constructor(private readonly coursesService: PresetCoursesService) {}

  @Get()
  async findAll(): Promise<Course[]> {
    return this.coursesService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Course> {
    const course = await this.coursesService.findOne(id)
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`)
    }
    return course
  }

  @Get('code/:code/version/:version')
  findByCodeAndVersion(
    @Param('code') code: string,
    @Param('version') version: string
  ): Promise<Course> {
    return this.coursesService.findByCodeAndVersion(code, version)
  }
  @Post()
  async create(@Body(ValidationPipe) createCourseDto: CreatePresetCourseDto): Promise<Course> {
    return this.coursesService.create(createCourseDto)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateCourseDto: UpdatePresetCourseDto
  ): Promise<Course> {
    const updatedCourse = await this.coursesService.update(id, updateCourseDto)
    if (!updatedCourse) {
      throw new NotFoundException(`Course with ID "${id}" not found`)
    }
    return updatedCourse
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.coursesService.remove(id)
  }

  // Rule-related endpoints

  @Get(':id/rules')
  async findAllRules(@Param('id', ParseIntPipe) id: number): Promise<Rule[]> {
    console.log('Fetching all rules')

    return this.coursesService.findAllRules(id)
  }

  @Get(':id/rules/:ruleId')
  async findOneRule(
    @Param('id', ParseIntPipe) id: number,
    @Param('ruleId', ParseIntPipe) ruleId: number
  ): Promise<Rule> {
    const rule = await this.coursesService.findOneRule(id, ruleId)
    if (!rule) {
      throw new NotFoundException(`Rule with ID "${ruleId}" not found in course "${id}"`)
    }
    return rule
  }

  @Get(':id/rules/by-type/:type')
  async findRuleByType(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: RuleType
  ): Promise<Rule> {
    const rule = await this.coursesService.findRuleByType(id, type)
    if (!rule) {
      throw new NotFoundException(`Rule with type "${type}" not found in course "${id}"`)
    }
    return rule
  }

  @Post(':id/rules')
  async createRule(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) createRuleDto: CreateRuleDto
  ): Promise<Rule> {
    return this.coursesService.createRule(id, createRuleDto)
  }

  @Put(':id/rules/:ruleId')
  async updateRule(
    @Param('id', ParseIntPipe) id: number,
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Body(ValidationPipe) updateRuleDto: UpdateRuleDto
  ): Promise<Rule> {
    const updatedRule = await this.coursesService.updateRule(id, ruleId, updateRuleDto)
    if (!updatedRule) {
      throw new NotFoundException(`Rule with ID "${ruleId}" not found in course "${id}"`)
    }
    return updatedRule
  }

  @Put(':id/rules/by-type/:type')
  async updateRuleByType(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: RuleType,
    @Body(ValidationPipe) updateRuleDto: UpdateRuleDto
  ): Promise<Rule> {
    const updatedRule = await this.coursesService.updateRuleByType(id, type, updateRuleDto)
    if (!updatedRule) {
      throw new NotFoundException(`Rule with type "${type}" not found in course "${id}"`)
    }
    return updatedRule
  }

  @Delete(':id/rules/:ruleId')
  async removeRule(
    @Param('id', ParseIntPipe) id: number,
    @Param('ruleId', ParseIntPipe) ruleId: number
  ): Promise<void> {
    await this.coursesService.removeRule(id, ruleId)
  }

  @Delete(':id/rules/by-type/:type')
  async removeRuleByType(
    @Param('id', ParseIntPipe) id: number,
    @Param('type') type: RuleType
  ): Promise<void> {
    await this.coursesService.removeRuleByType(id, type)
  }
}
