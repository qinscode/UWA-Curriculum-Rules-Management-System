import { Injectable, NotFoundException } from '@nestjs/common'
import * as puppeteer from 'puppeteer'
import * as fs from 'fs'
import * as path from 'path'
import { courseRulesTemplate } from './courseRulesTemplate'
import { config } from 'dotenv'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Course } from '../courses/entities/course.entity'
import { Rule } from '../rules/entities/rule.entity'
import { Requirement } from '../requirements/entities/requirement.entity'
import { NumberingStyle } from '../requirements/entities/style.enum'
import { PDFRuleType } from './pdf-rule-type'
import { v4 as uuidv4 } from 'uuid'

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
    @InjectRepository(Rule)
    private ruleRepository: Repository<Rule>
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
      relations: ['rules', 'rules.requirements', 'rules.requirements.children'],
    })

    if (!course) {
      throw new NotFoundException(`Course with ID "${courseId}" not found`)
    }

    return course.rules.map((rule) => {
      rule.name = PDFRuleType.getPrintRuleType(rule.type)
      rule.requirements = this.buildRequirementTree(
        rule.requirements.filter((req) => !req.parentId)
      )
      return rule
    })
  }

  private buildRequirementTree(requirements: Requirement[], level: number = 0): Requirement[] {
    return requirements.map((req) => {
      req.style = this.getStyleForLevel(level, req.style)
      if (req.children) {
        req.children = this.buildRequirementTree(req.children, level + 1)
      }
      return req
    })
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

    // Generate a unique filename using UUID
    const uniqueId = uuidv4()
    const pdfFileName = `course_${courseId}_rules_${uniqueId}.pdf`
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
      margin: {
        top: '5mm', // Top margin
        bottom: '5mm', // Bottom margin
        left: '5mm', // Left margin
        right: '5mm', // Right margin
      },
    })

    await browser.close()

    return { url: `${this.PDF_URL_PREFIX}/${pdfFileName}` }
  }

  async generateCourseHTML(courseId: string): Promise<{ url: string }> {
    const rules = await this.getCourseRules(courseId)
    const htmlContent = courseRulesTemplate(rules)

    // Generate a unique filename using UUID
    const uniqueId = uuidv4()
    const htmlFileName = `course_${courseId}_rules_${uniqueId}.html`
    const htmlFilePath = path.join(this.htmlDirectory, htmlFileName)
    fs.writeFileSync(htmlFilePath, htmlContent)

    return { url: `${this.HTML_URL_PREFIX}/${htmlFileName}` }
  }
}
