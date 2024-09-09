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

@Controller('rules')
@UseGuards(JwtAuthGuard)
export class RulesController {
  private readonly logger = new Logger(RulesController.name)

  constructor(private readonly rulesService: RulesService) {}

  @Get()
  async findAll(): Promise<Rule[]> {
    this.logger.log('Fetching all rules')
    return this.rulesService.findAll()
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
