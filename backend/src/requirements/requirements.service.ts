import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Requirement } from './entities/requirement.entity'
import { Rule } from '../rules/entities/rule.entity'
import { CreateRequirementDto } from './dto/requirement.dto'

@Injectable()
export class RequirementsService {
  private readonly logger = new Logger(RequirementsService.name)

  constructor(
    @InjectRepository(Requirement)
    private requirementsRepository: Repository<Requirement>,
    @InjectRepository(Rule)
    private rulesRepository: Repository<Rule>,
    private dataSource: DataSource
  ) {}

  async createRequirement(
    courseId: number,
    ruleId: number,
    createRequirementDto: CreateRequirementDto
  ): Promise<Requirement> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // 查找相关的规则
      const rule = await this.rulesRepository.findOne({
        where: { id: ruleId, course: { id: courseId } },
      })
      if (!rule) {
        throw new NotFoundException(`未找到课程 "${courseId}" 中 ID 为 "${ruleId}" 的规则`)
      }

      // 创建新的要求实体
      const requirement = this.requirementsRepository.create({
        content: createRequirementDto.content,
        style: createRequirementDto.style,
        is_connector: createRequirementDto.is_connector,
        order_index: createRequirementDto.order_index,
        rule,
      })

      this.logger.log(`正在创建要求：${JSON.stringify(requirement)}`)
      const savedRequirement = await queryRunner.manager.save(requirement)
      this.logger.log(`已保存要求：${JSON.stringify(savedRequirement)}`)

      // 如果有子要求，递归创建它们
      if (createRequirementDto.children && createRequirementDto.children.length > 0) {
        await this.createChildren(savedRequirement, createRequirementDto.children, queryRunner)
      }

      // 提交事务
      await queryRunner.commitTransaction()
      this.logger.log(`为规则 ${ruleId} 创建了新的要求，ID 为 ${savedRequirement.id}`)

      // 返回创建的要求，包括其子要求
      return this.requirementsRepository.findOne({
        where: { id: savedRequirement.id },
        relations: ['children'],
      })
    } catch (err) {
      // 如果出现错误，回滚事务
      this.logger.error(`为规则 ${ruleId} 创建要求失败`, err.stack)
      await queryRunner.rollbackTransaction()
      throw new InternalServerErrorException('创建要求失败')
    } finally {
      // 释放查询运行器
      await queryRunner.release()
    }
  }

  private async createChildren(
    parentRequirement: Requirement,
    children: CreateRequirementDto[],
    queryRunner: any
  ): Promise<void> {
    for (const childDto of children) {
      const childRequirement = this.requirementsRepository.create({
        content: childDto.content,
        style: childDto.style,
        is_connector: childDto.is_connector,
        order_index: childDto.order_index,
        parent: parentRequirement,
        rule: parentRequirement.rule,
      })

      this.logger.log(`Creating req：${JSON.stringify(childRequirement)}`)
      const savedChild = await queryRunner.manager.save(childRequirement)
      this.logger.log(`Saved req：${JSON.stringify(savedChild)}`)

      if (childDto.children && childDto.children.length > 0) {
        await this.createChildren(savedChild, childDto.children, queryRunner)
      }
    }
  }
}
