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
import { RulesService } from './rules.service'
import { Rule } from './entities/rule.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto'

@Controller('courses/:courseId/rules')
@UseGuards(JwtAuthGuard)
export class RulesController {
  private readonly logger = new Logger(RulesController.name)

  constructor(private readonly rulesService: RulesService) {}

  @Get()
  async findAll(@Param('courseId', ParseIntPipe) courseId: number): Promise<Rule[]> {
    this.logger.log(`Fetching all rules for course ${courseId}`)
    return this.rulesService.findAll(courseId)
  }

  @Get(':id')
  async findOne(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<Rule> {
    this.logger.log(`Fetching rule ${id} for course ${courseId}`)
    const rule = await this.rulesService.findOne(courseId, id)
    if (!rule) {
      throw new NotFoundException(`Rule with ID "${id}" not found in course "${courseId}"`)
    }
    return rule
  }

  @Post()
  async create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() createRuleDto: CreateRuleDto
  ): Promise<Rule> {
    this.logger.log(`Creating new rule for course ${courseId}`)
    return this.rulesService.create(courseId, createRuleDto)
  }

  @Put(':id')
  async update(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRuleDto: UpdateRuleDto
  ): Promise<Rule> {
    this.logger.log(`Updating rule ${id} for course ${courseId}`)
    const updatedRule = await this.rulesService.update(courseId, id, updateRuleDto)
    if (!updatedRule) {
      throw new NotFoundException(`Rule with ID "${id}" not found in course "${courseId}"`)
    }
    return updatedRule
  }

  @Delete(':id')
  async remove(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('id', ParseIntPipe) id: number
  ): Promise<void> {
    this.logger.log(`Removing rule ${id} from course ${courseId}`)
    await this.rulesService.remove(courseId, id)
  }
}
