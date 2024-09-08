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
} from '@nestjs/common'
import { RequirementsService } from './requirements.service'
import { Requirement } from './entities/requirement.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateRequirementDto, UpdateRequirementDto } from './dto/requirement.dto'

@Controller('courses/:courseId/rules/:ruleId/requirements')
@UseGuards(JwtAuthGuard)
export class RequirementsController {
  private readonly logger = new Logger(RequirementsController.name)

  constructor(private readonly requirementsService: RequirementsService) {}

  @Get()
  async findAllRequirements(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number
  ): Promise<Requirement[]> {
    this.logger.log(`Fetching all requirements for rule ${ruleId} in course ${courseId}`)
    return this.requirementsService.findAllRequirements(courseId, ruleId)
  }

  @Post()
  async createRequirement(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Body() createRequirementDto: CreateRequirementDto
  ): Promise<Requirement> {
    this.logger.log(`Creating new requirement for rule ${ruleId} in course ${courseId}`)
    return this.requirementsService.createRequirement(courseId, ruleId, createRequirementDto)
  }

  @Put(':requirementId')
  async updateRequirement(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Param('requirementId', ParseIntPipe) requirementId: number,
    @Body() updateRequirementDto: UpdateRequirementDto
  ): Promise<Requirement> {
    this.logger.log(
      `Updating requirement ${requirementId} for rule ${ruleId} in course ${courseId}`
    )
    return this.requirementsService.updateRequirement(
      courseId,
      ruleId,
      requirementId,
      updateRequirementDto
    )
  }

  @Delete(':requirementId')
  async removeRequirement(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Param('requirementId', ParseIntPipe) requirementId: number
  ): Promise<void> {
    this.logger.log(
      `Removing requirement ${requirementId} from rule ${ruleId} in course ${courseId}`
    )
    await this.requirementsService.removeRequirement(courseId, ruleId, requirementId)
  }

  @Post(':requirementId/children')
  async addChildRequirement(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Param('requirementId', ParseIntPipe) requirementId: number,
    @Body() createRequirementDto: CreateRequirementDto
  ): Promise<Requirement> {
    this.logger.log(`Adding child requirement for requirement ${requirementId} in rule ${ruleId}`)
    return this.requirementsService.addChildRequirement(
      courseId,
      ruleId,
      requirementId,
      createRequirementDto
    )
  }

  @Get(':requirementId/children')
  async findChildren(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Param('requirementId', ParseIntPipe) requirementId: number
  ): Promise<Requirement[]> {
    this.logger.log(`Fetching children of requirement ${requirementId} in rule ${ruleId}`)
    return this.requirementsService.findChildren(courseId, ruleId, requirementId)
  }
}
