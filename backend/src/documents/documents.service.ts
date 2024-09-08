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

    return course.rules.map((rule) => ({
      title: rule.name,
      content: rule.requirements.map((req) => ({
        number: req.order_index.toString(),
        text: req.content,
      })),
    }))
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
