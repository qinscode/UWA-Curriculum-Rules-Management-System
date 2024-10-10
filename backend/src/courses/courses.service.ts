import { Injectable, NotFoundException, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { Course } from './entities/course.entity'
import { CreateCourseDto, UpdateCourseDto } from './dto'
import { Rule } from '../rules/entities/rule.entity'
import { Requirement } from '../requirements/entities/requirement.entity'
import { RuleType } from '../rules/entities/rule.enum'
import { NumberingStyle } from '../requirements/entities/style.enum'
import { CreateRuleDto, UpdateRuleDto } from '../rules/dto/rule.dto'

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name)

  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(Rule)
    private rulesRepository: Repository<Rule>,
    @InjectRepository(Requirement)
    private requirementsRepository: Repository<Requirement>
  ) {}

  async findAll(): Promise<any[]> {
    const allCourses = await this.coursesRepository.find({
      order: { code: 'ASC', version: 'DESC' },
    })

    const latestVersions = new Map<string, Course>()

    allCourses.forEach((course) => {
      if (!latestVersions.has(course.code)) {
        latestVersions.set(course.code, course)
      }
    })

    return await Promise.all(
      Array.from(latestVersions.values()).map(async (course) => {
        const versions = await this.coursesRepository
          .createQueryBuilder('course')
          .select('course.version', 'version')
          .where('course.code = :code', { code: course.code })
          .orderBy('course.version', 'DESC')
          .getRawMany()

        return {
          ...course,
          versions: versions.map((v) => v.version.toString()),
        }
      })
    )
  }

  async findOne(id: number): Promise<any> {
    const course = await this.coursesRepository.findOne({ where: { id } })

    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`)
    }

    const relatedCourses = await this.coursesRepository.find({
      where: { code: course.code },
      order: { version: 'DESC' },
    })

    const versions = relatedCourses.map((c) => c.version.toString())

    return {
      ...course,
      versions,
    }
  }

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    this.logger.log(`Creating new course with data: ${JSON.stringify(createCourseDto)}`)

    try {
      const newCourse = this.coursesRepository.create(createCourseDto)
      const savedCourse = await this.coursesRepository.save(newCourse)

      this.logger.log(`Successfully saved course with ID: ${savedCourse.id}`)

      // Add default rules and requirements
      await this.addDefaultRules(savedCourse)
      await this.addDefaultRequirements(savedCourse)

      return savedCourse
    } catch (error) {
      this.logger.error(`Failed to create course: ${error.message}`, error.stack)
      throw error
    }
  }

  private async addDefaultRules(course: Course): Promise<void> {
    const defaultRules: Partial<Rule>[] = Object.values(RuleType).map((type) => ({
      name: type,
      type,
      description: `Default description for ${type}`,
      course,
    }))

    this.logger.log(`Adding default rules for course: ${course.id}`)

    try {
      await this.rulesRepository.save(defaultRules)
      this.logger.log(`Successfully added default rules for course: ${course.id}`)
    } catch (error) {
      this.logger.error(`Failed to add default rules: ${error.message}`, error.stack)
      throw error
    }
  }

  private async addDefaultRequirements(course: Course): Promise<void> {
    const rules = await this.rulesRepository.find({ where: { course: { id: course.id } } })
    const asrRule = rules.find((rule) => rule.type === RuleType.ASR)
    const acecrsRule = rules.find((rule) => rule.type === RuleType.ACECRS)

    if (asrRule) {
      const asrRequirements = [
        {
          content: 'The Student Rules apply to students in this course.',
          style: NumberingStyle.None,
        },
        {
          content:
            'The policy, policy statements and guidance documents and student procedures apply, except as otherwise indicated in\n',
          style: NumberingStyle.None,
        },
      ]

      await this.createRequirements(asrRule, asrRequirements)
    }

    if (acecrsRule) {
      const acecrsRequirements = [
        {
          content:
            'A student who enrols in this course for the first time irrespective of whether they have previously been enrolled in another course of the University, must undertake the Academic Conduct Essentials module (the ACE module) and the Communication and Research Skills module (the CARS module).\n',
          style: NumberingStyle.Numeric,
        },
        {
          content:
            'A student must successfully complete the ACE module within the first teaching period of their enrolment. Failure to complete the module within this timeframe will result in the student’s unit results from this teaching period being withheld. These results will continue to be withheld until students avail themselves of a subsequent opportunity to achieve a passing grade in the ACE module. In the event that students complete units in subsequent teaching periods without completing the ACE module, these results will similarly be withheld. Students will not be permitted to submit late review or appeal applications regarding results which have been withheld for this reason and which they were unable to access in the normally permitted review period.',
          style: NumberingStyle.Numeric,
        },
      ]

      await this.createRequirements(acecrsRule, acecrsRequirements)
    }
  }

  private async createRequirements(
    rule: Rule,
    requirementsData: { content: string; style: NumberingStyle }[]
  ): Promise<void> {
    const requirements = requirementsData.map((data, index) =>
      this.requirementsRepository.create({
        ...data,
        rule,
        order_index: index,
        is_connector: false,
      })
    )

    await this.requirementsRepository.save(requirements)
  }

  async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findOne(id)
    Object.assign(course, updateCourseDto)
    return this.coursesRepository.save(course)
  }

  async remove(id: number): Promise<void> {
    const course = await this.coursesRepository.findOne({ where: { id } })
    if (!course) {
      throw new NotFoundException(`Course with ID "${id}" not found`)
    }
    await this.coursesRepository.remove(course)
  }

  async findByCodeAndVersion(code: string, version: string): Promise<Course> {
    const course = await this.coursesRepository.findOne({
      where: { code, version: version.toString() },
    })

    if (!course) {
      throw new NotFoundException(`Course with code "${code}" and version "${version}" not found`)
    }

    return course
  }

  async findAllRules(courseId: number): Promise<Rule[]> {
    const course = await this.findOne(courseId)
    return this.rulesRepository.find({ where: { course: { id: course.id } } })
  }

  async findOneRule(courseId: number, ruleId: number): Promise<Rule> {
    const course = await this.findOne(courseId)
    return this.rulesRepository.findOne({ where: { id: ruleId, course: { id: course.id } } })
  }

  async findRuleByType(courseId: number, type: RuleType): Promise<Rule> {
    const course = await this.findOne(courseId)
    return this.rulesRepository.findOne({ where: { type, course: { id: course.id } } })
  }

  async createRule(courseId: number, createRuleDto: CreateRuleDto): Promise<Rule> {
    const course = await this.findOne(courseId)
    const rule = this.rulesRepository.create({
      ...createRuleDto,
      course,
      requirements: createRuleDto.requirements?.map((req) => ({
        ...req,
        style: req.style as NumberingStyle,
      })),
    } as DeepPartial<Rule>)
    return this.rulesRepository.save(rule as Rule)
  }

  async updateRule(courseId: number, ruleId: number, updateRuleDto: UpdateRuleDto): Promise<Rule> {
    const rule = await this.findOneRule(courseId, ruleId)
    if (!rule) {
      throw new NotFoundException(`Rule with ID "${ruleId}" not found in course "${courseId}"`)
    }
    Object.assign(rule, updateRuleDto)
    return this.rulesRepository.save(rule)
  }

  async updateRuleByType(
    courseId: number,
    type: RuleType,
    updateRuleDto: UpdateRuleDto
  ): Promise<Rule> {
    const rule = await this.findRuleByType(courseId, type)
    if (!rule) {
      throw new NotFoundException(`Rule with type "${type}" not found in course "${courseId}"`)
    }
    Object.assign(rule, updateRuleDto)
    return this.rulesRepository.save(rule)
  }

  async removeRule(courseId: number, ruleId: number): Promise<void> {
    const rule = await this.findOneRule(courseId, ruleId)
    if (!rule) {
      throw new NotFoundException(`Rule with ID "${ruleId}" not found in course "${courseId}"`)
    }
    await this.rulesRepository.remove(rule)
  }

  async removeRuleByType(courseId: number, type: RuleType): Promise<void> {
    const rule = await this.findRuleByType(courseId, type)
    if (!rule) {
      throw new NotFoundException(`Rule with type "${type}" not found in course "${courseId}"`)
    }
    await this.rulesRepository.remove(rule)
  }
}
