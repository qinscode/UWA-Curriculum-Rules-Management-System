import { Injectable, NotFoundException } from '@nestjs/common'
import * as puppeteer from 'puppeteer'
import * as fs from 'fs'
import * as path from 'path'
import { courseRulesTemplate } from './courseRulesTemplate'
import { Rule } from 'src/types'
import { config } from 'dotenv'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Course } from '../courses/entities/course.entity'
import { Rule as RuleEntity } from '../rules/entities/rule.entity'
import { Requirement } from '../requirements/entities/requirement.entity'
import { NumberingStyle } from '../requirements/entities/style.enum'
import { PDFRuleType } from './pdf-rule-type'

config()

@Injectable()
export class DocumentsService {
  private readonly pdfDirectory = 'public/pdf'
  private readonly htmlDirectory = 'public/html'
  private readonly PDF_URL_PREFIX: string
  private readonly HTML_URL_PREFIX: string
  private readonly executablePath: string

  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    @InjectRepository(RuleEntity)
    private ruleRepository: Repository<RuleEntity>
  ) {
    if (!fs.existsSync(this.pdfDirectory)) {
      fs.mkdirSync(this.pdfDirectory, { recursive: true })
    }
    if (!fs.existsSync(this.htmlDirectory)) {
      fs.mkdirSync(this.htmlDirectory, { recursive: true })
    }
    this.PDF_URL_PREFIX = process.env.PDF_URL_PREFIX
    this.HTML_URL_PREFIX = process.env.HTML_URL_PREFIX
    this.executablePath = process.env.executablePath
    if (!this.PDF_URL_PREFIX || !this.HTML_URL_PREFIX) {
      throw new Error(
        'PDF_URL_PREFIX or HTML_URL_PREFIX is not defined in the environment variables'
      )
    }
  }

  private async getCourseRules(courseId: string): Promise<Rule[]> {
    const course = await this.courseRepository.findOne({
      where: { id: Number(courseId) },
      relations: ['rules', 'rules.requirements'],
    })

    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`)
    }

    return course.rules.map((rule, index) => ({
      title: PDFRuleType.getPrintRuleType(rule.type), // 使用 PDFRuleType 获取打印用的规则类型名称
      ruleIndex: index + 1,
      content: rule.requirements.length > 0
        ? this.buildRequirementTree(rule.requirements, index + 1)
        : [{ text: 'TO BE FILLED BY DEFAULT', style: NumberingStyle.None, ruleIndex: index + 1 }],
    }))
  }

  private buildRequirementTree(requirements: Requirement[], ruleIndex: number): any[] {
    const rootRequirements = requirements.filter((req) => !req.parentId)
    return rootRequirements.map((req) => this.buildRequirementNode(req, requirements, 0, ruleIndex))
  }

  private buildRequirementNode(
    requirement: Requirement,
    allRequirements: Requirement[],
    level: number,
    ruleIndex: number
  ): any {
    const children = allRequirements.filter((req) => req.parentId === requirement.id)
    return {
      number: requirement.order_index.toString(),
      text: requirement.content,
      style: this.getStyleForLevel(level, requirement.style),
      children: children.map((child) =>
        this.buildRequirementNode(child, allRequirements, level + 1, ruleIndex)
      ),
      ruleIndex: level === 0 ? ruleIndex : undefined,
    }
  }

  private getStyleForLevel(level: number, defaultStyle: NumberingStyle): NumberingStyle {
    switch (level) {
      case 0:
        return NumberingStyle.Numeric
      case 1:
        return NumberingStyle.Alphabetic
      case 2:
        return NumberingStyle.Roman
      default:
        return defaultStyle || NumberingStyle.None
    }
  }

  async generateCoursePDF(courseId: string): Promise<{ url: string }> {
    const rules = await this.getCourseRules(courseId)
    const htmlContent = courseRulesTemplate(rules)

    const pdfFileName = `course_${courseId}_rules.pdf`
    const pdfFilePath = path.join(this.pdfDirectory, pdfFileName)

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
      ...(this.executablePath ? { executablePath: this.executablePath } : {}),
    })
    const page = await browser.newPage()

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

    await page.pdf({
      path: pdfFilePath,
      format: 'A4',
      printBackground: true,
    })

    await browser.close()

    return { url: `${this.PDF_URL_PREFIX}/${pdfFileName}` }
  }

  async generateCourseHTML(courseId: string): Promise<{ url: string }> {
    const rules = await this.getCourseRules(courseId)
    const htmlContent = courseRulesTemplate(rules)

    const htmlFileName = `course_${courseId}_rules.html`
    const htmlFilePath = path.join(this.htmlDirectory, htmlFileName)
    fs.writeFileSync(htmlFilePath, htmlContent)

    return { url: `${this.HTML_URL_PREFIX}/${htmlFileName}` }
  }
}
