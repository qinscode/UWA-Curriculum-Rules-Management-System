import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DataSource } from 'typeorm'
import { Rule } from './entities/rule.entity'
import { Course } from '../courses/entities/course.entity'
import { CreateRuleDto, UpdateRuleDto } from './dto/rule.dto'

@Injectable()
export class RulesService {
  private readonly logger = new Logger(RulesService.name)

  constructor(
    @InjectRepository(Rule)
    private rulesRepository: Repository<Rule>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    private dataSource: DataSource
  ) {}

  async findAll(courseId: number): Promise<Rule[]> {
    return this.rulesRepository
      .createQueryBuilder('rule')
      .leftJoinAndSelect('rule.requirements', 'requirement')
      .where('rule.courseId = :courseId', { courseId })
      .orderBy('rule.id', 'ASC')
      .addOrderBy('requirement.order_index', 'ASC')
      .getMany()
  }

  async findOne(courseId: number, id: number): Promise<Rule> {
    const rule = await this.rulesRepository.findOne({
      where: { id, course: { id: courseId } },
      relations: ['requirements'],
    })
    if (!rule) {
      this.logger.warn(`Rule with ID "${id}" not found in course "${courseId}"`)
      throw new NotFoundException(`Rule with ID "${id}" not found in course "${courseId}"`)
    }
    return rule
  }

  async create(courseId: number, createRuleDto: CreateRuleDto): Promise<Rule> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const course = await this.coursesRepository.findOne({ where: { id: courseId } })
      if (!course) {
        throw new NotFoundException(`Course with ID "${courseId}" not found`)
      }

      const rule = this.rulesRepository.create({
        ...createRuleDto,
        course,
      })

      const savedRule = await queryRunner.manager.save(rule)

      await queryRunner.commitTransaction()

      this.logger.log(`Created new rule with ID ${savedRule.id} for course ${courseId}`)
      return this.findOne(courseId, savedRule.id)
    } catch (err) {
      this.logger.error(`Failed to create rule for course ${courseId}`, err.stack)
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }

  async update(courseId: number, id: number, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const rule = await this.findOne(courseId, id)

      Object.assign(rule, updateRuleDto)

      await queryRunner.manager.save(rule)
      await queryRunner.commitTransaction()

      this.logger.log(`Updated rule with ID ${id} for course ${courseId}`)
      return this.findOne(courseId, id)
    } catch (err) {
      this.logger.error(`Failed to update rule ${id} for course ${courseId}`, err.stack)
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }

  async remove(courseId: number, id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const rule = await this.findOne(courseId, id)
      if (!rule) {
        throw new NotFoundException(`Rule with ID "${id}" not found in course "${courseId}"`)
      }

      await queryRunner.manager.remove(rule)

      await queryRunner.commitTransaction()
      this.logger.log(`Removed rule with ID ${id} from course ${courseId}`)
    } catch (err) {
      this.logger.error(`Failed to remove rule ${id} from course ${courseId}`, err.stack)
      await queryRunner.rollbackTransaction()
      throw err
    } finally {
      await queryRunner.release()
    }
  }
}
