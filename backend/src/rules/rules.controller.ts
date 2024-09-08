import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common'
import { RulesService } from './rules.service'
import { Rule } from './entities/rule.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateRuleDto, UpdateRuleDto } from './dto'

@Controller('courses/:courseId/rules')
@UseGuards(JwtAuthGuard)
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Get()
  findAll(@Param('courseId') courseId: string): Promise<Rule[]> {
    return this.rulesService.findAll(+courseId)
  }

  @Get(':id')
  findOne(@Param('courseId') courseId: string, @Param('id') id: string): Promise<Rule> {
    return this.rulesService.findOne(+courseId, +id)
  }

  @Post()
  create(@Param('courseId') courseId: string, @Body() createRuleDto: CreateRuleDto): Promise<Rule> {
    return this.rulesService.create(+courseId, createRuleDto)
  }

  @Put(':id')
  update(
    @Param('courseId') courseId: string,
    @Param('id') id: string,
    @Body() updateRuleDto: UpdateRuleDto
  ): Promise<Rule> {
    return this.rulesService.update(+courseId, +id, updateRuleDto)
  }

  @Delete(':id')
  remove(@Param('courseId') courseId: string, @Param('id') id: string): Promise<void> {
    return this.rulesService.remove(+courseId, +id)
  }
}
