import { Injectable } from '@nestjs/common'
import * as puppeteer from 'puppeteer'
import * as fs from 'fs'
import * as path from 'path'
import { courseRulesTemplate } from './courseRulesTemplate'
import { Rule } from 'src/types'
import { config } from 'dotenv'

const rules_list: Rule[] = [
  {
    title: 'Applicability of the Student Rules, policies and procedures',
    content: [
      {
        number: '1.(1)',
        text: 'The Student Rules apply to students in this course.',
      },
      {
        number: '(2)',
        text: 'The policy, policy statements and guidance documents and student procedures apply, except as otherwise indicated in the rules for this course.',
      },
    ],
  },
  {
    title: 'Academic Conduct Essentials and Communication and Research Skills modules',
    content: [
      {
        number: '2.(1)',
        text: 'A student who enrols in this course for the first time irrespective of whether they have previously been enrolled in another course of the University, must undertake the Academic Conduct Essentials module (the ACE module) and the Communication and Research Skills module (the CARS module).',
      },
      {
        number: '(2)',
        text: "A student must successfully complete the ACE module within the first teaching period of their enrolment. Failure to complete the module within this timeframe will result in the student's unit results from this teaching period being withheld. These results will continue to be withheld until students avail themselves of a subsequent opportunity to achieve a passing grade in the ACE module. In the event that students complete units in subsequent teaching periods without completing the ACE module, these results will similarly be withheld. Students will not be permitted to submit late review or appeal applications regarding results which have been withheld for this reason and which they were unable to access in the normally permitted review period.",
      },
    ],
  },
  {
    title: 'Admission rules - English language competency requirements',
    content: [
      {
        number: '3.',
        text: "To be considered eligible for consideration for admission to this course an applicant must satisfy the University's English language competence requirement as set out in the University Policy on Admission: Coursework.",
      },
    ],
  },
  {
    title: 'Admission rules - admission requirements',
    content: [
      {
        number: '4.',
        text: 'To be considered for admission to this course an applicant must have—',
      },
      {
        number: '(a)',
        text: "a bachelor's degree, or an equivalent qualification, as recognised by UWA;",
      },
      {
        number: '',
        text: 'and',
      },
      {
        number: '(b)',
        text: 'the equivalent of a UWA weighted average mark of at least 65 per cent;',
      },
      {
        number: '',
        text: 'and',
      },
      {
        number: '(c)',
        text: 'completed Mathematics Methods ATAR, or equivalent, as recognised by UWA.',
      },
    ],
  },
  {
    title: 'Admission rules - ranking and selection',
    content: [
      {
        number: '5.',
        text: 'Where relevant, admission will be awarded to the highest ranked applicants or applicants selected based on the relevant requirements.',
      },
    ],
  },
  {
    title: 'Articulation and Exit Awards',
    content: [
      {
        number: '6.(1)',
        text: 'This course has the following exit awards:',
      },
      {
        number: '•',
        text: '60220 Graduate Certificate in Information Technology (24 points)',
      },
      {
        number: '•',
        text: '60320 Graduate Diploma in Information Technology (48 points)',
      },
      {
        number: '(2)',
        text: 'A student who withdraws from the Master of Information Technology course before completing it, but after completing Level 4 and Level 5 units to the value of 24 points, may apply to the School to be awarded the Graduate Certificate in Information Technology.',
      },
      {
        number: '(3)',
        text: 'A student who withdraws from the Master of Information Technology course before completing it, but after completing Level 4 and Level 5 units to the value of 48 points, may apply to the School to be awarded the Graduate Diploma in Information Technology.',
      },
    ],
  },
]

config()

@Injectable()
export class DocumentsService {
  private readonly pdfDirectory = 'public/pdfs'

  private readonly PDF_URL_PREFIX: string

  constructor() {
    if (!fs.existsSync(this.pdfDirectory)) {
      fs.mkdirSync(this.pdfDirectory, { recursive: true })
    }
    this.PDF_URL_PREFIX = process.env.PDF_URL_PREFIX

    if (!this.PDF_URL_PREFIX) {
      throw new Error('PDF_URL_PREFIX is not defined in the environment variables')
    }
  }

  async generateCoursePDF(courseId: string): Promise<{ url: string }> {
    const fileName = `course_${courseId}_rules.pdf`
    const filePath = path.join(this.pdfDirectory, fileName)

    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Use the template function to generate the HTML content
    const htmlContent = courseRulesTemplate(rules_list)

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
    })

    await browser.close()

    return { url: `${this.PDF_URL_PREFIX}/${fileName}` }
  }
}
