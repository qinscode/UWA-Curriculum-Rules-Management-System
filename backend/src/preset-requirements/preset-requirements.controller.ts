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
  ValidationPipe,
} from '@nestjs/common'
import { PresetRequirementsService } from './preset-requirements.service'
import { Requirement } from './entities/preset-requirement.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CreateRequirementDto, UpdateRequirementDto } from './dto/preset-requirement.dto'

@Controller('courses/:courseId/rules/:ruleId/requirements')
@UseGuards(JwtAuthGuard)
export class PresetRequirementsController {
  private readonly logger = new Logger(PresetRequirementsController.name)

  constructor(private readonly requirementsService: PresetRequirementsService) {}

  @Get()
  async findAllRequirements(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number
  ): Promise<Omit<Requirement, 'parentId'>[]> {
    this.logger.log(`Fetching all requirements for rule ${ruleId} in course ${courseId}`)
    return this.requirementsService.findAllRequirements(courseId, ruleId)
  }

  @Post()
  async createRequirement(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Body(new ValidationPipe({ whitelist: true })) createRequirementDtos: CreateRequirementDto[]
  ): Promise<Requirement[]> {
    this.logger.log(`Receive createRequirement request：${JSON.stringify(createRequirementDtos)}`)
    return Promise.all(
      createRequirementDtos.map((dto) =>
        this.requirementsService.createRequirement(courseId, ruleId, dto)
      )
    )
  }

  @Put()
  async updateRequirements(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Param('ruleId', ParseIntPipe) ruleId: number,
    @Body() updateRequirementData: UpdateRequirementDto | UpdateRequirementDto[]
  ): Promise<Requirement[]> {
    this.logger.log(`Updating requirements for rule ${ruleId} in course ${courseId}`)
    // Ensure we're always passing an array to the service
    const updateRequirementDtos = Array.isArray(updateRequirementData)
      ? updateRequirementData
      : [updateRequirementData]
    return this.requirementsService.updateRequirements(courseId, ruleId, updateRequirementDtos)
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
