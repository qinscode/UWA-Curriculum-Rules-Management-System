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
  Query,
} from '@nestjs/common'
import { RulesService } from './rules.service'
import { Rule } from './entities/rule.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto'
import { RuleType } from './entities/rule.enum'

@Controller('courses/:courseId/rules')
@UseGuards(JwtAuthGuard)
export class RulesController {
  private readonly logger = new Logger(RulesController.name)

  constructor(private readonly rulesService: RulesService) { }

  @Get()
  async findAllRules(@Param('courseId', ParseIntPipe) courseId: number) {
    const rules = await this.rulesService.findAllRules(courseId)
    // Load requirements with hierarchical structure for each rule
    for (const rule of rules) {
      rule.requirements = await this.rulesService.findRuleRequirementsHierarchy(rule.id)
    }
    return rules
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Rule> {
    this.logger.log(`Fetching rule ${id}`)
    const rule = await this.rulesService.findOne(id)
    if (!rule) {
      throw new NotFoundException(`Rule with ID "${id}" not found`)
    }
    return rule
  }

  @Get('by-type/:type')
  async findByType(@Param('type') type: RuleType): Promise<Rule[]> {
    this.logger.log(`Fetching rules with type ${type}`)
    return this.rulesService.findByType(type)
  }

  @Post()
  async create(@Body() createRuleDto: CreateRuleDto): Promise<Rule> {
    this.logger.log('Creating new rule')
    return this.rulesService.create(createRuleDto)
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRuleDto: UpdateRuleDto
  ): Promise<Rule> {
    this.logger.log(`Updating rule ${id}`)
    const updatedRule = await this.rulesService.update(id, updateRuleDto)
    if (!updatedRule) {
      throw new NotFoundException(`Rule with ID "${id}" not found`)
    }
    return updatedRule
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    this.logger.log(`Removing rule ${id}`)
    await this.rulesService.remove(id)
  }
}
