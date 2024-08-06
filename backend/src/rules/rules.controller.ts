// src/rules/rules.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common'
import { RulesService } from './rules.service'
import { CreateRuleDto, UpdateRuleDto, RuleDto } from './dto/rule.dto'
import { RuleHistoryDto } from './dto/rule-history.dto'
import { Rule } from './entities/rule.entity'

@Controller('rules')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search = ''
  ): Promise<{ rules: Rule[]; total: number }> {
    return this.rulesService.findAll(page, limit, search)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<RuleDto> {
    const rule = await this.rulesService.findOne(+id)
    if (!rule) {
      throw new HttpException('Rule not found', HttpStatus.NOT_FOUND)
    }
    return rule
  }

  @Post()
  async create(@Body() createRuleDto: CreateRuleDto): Promise<RuleDto> {
    return this.rulesService.create(createRuleDto)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateRuleDto: UpdateRuleDto): Promise<RuleDto> {
    const updatedRule = await this.rulesService.update(+id, updateRuleDto)
    if (!updatedRule) {
      throw new HttpException('Rule not found', HttpStatus.NOT_FOUND)
    }
    return updatedRule
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    const deleted = await this.rulesService.remove(+id)
    if (!deleted) {
      throw new HttpException('Rule not found', HttpStatus.NOT_FOUND)
    }
    return { success: true }
  }

  @Get(':id/history')
  async getRuleHistory(@Param('id') id: string): Promise<RuleHistoryDto[]> {
    const history = await this.rulesService.getRuleHistory(+id)
    if (!history || history.length === 0) {
      throw new HttpException('Rule history not found', HttpStatus.NOT_FOUND)
    }
    return history
  }

  @Put(':id/restore/:version')
  async restoreRuleVersion(
    @Param('id') id: string,
    @Param('version') version: string
  ): Promise<RuleDto> {
    try {
      const restoredRule = await this.rulesService.restoreRuleVersion(+id, +version)
      if (!restoredRule) {
        throw new HttpException('Rule or version not found', HttpStatus.NOT_FOUND)
      }
      return restoredRule
    } catch (error) {
      console.error('Error in restoreRuleVersion controller:', error)
      throw new HttpException('Failed to restore rule version', HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
