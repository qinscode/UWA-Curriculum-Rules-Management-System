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
  {
    title: 'Course structure',
    content: [
      {
        number: '7.(1)',
        text: 'The course consists of units to a total value of 96 points (maximum value) which include conversion units to a value of 24 points.',
      },
      {
        number: '(2)',
        text: 'Units must be selected in accordance with the course structure, as set out in these rules.',
      },
      {
        number: '(3)',
        text: "Students who have completed a bachelor's degree with a major in a cognate area, or equivalent as recognised by the Faculty are granted credit for conversion units up to a value of 24 points.",
      },
    ],
  },
  {
    title: 'Satisfactory progress rule',
    content: [
      {
        number: '8.',
        text: 'To make satisfactory progress a student must pass units to a point value greater than half the total value of units in which they remain enrolled after the final date for withdrawal without academic penalty.',
      },
    ],
  },
  {
    title: 'Progress status',
    content: [
      {
        number: '10.(1)',
        text: 'A student who makes satisfactory progress in terms of Rule 8 is assigned the status of "Good Standing".',
      },
      {
        number: '(2)',
        text: 'Unless the relevant board determines otherwise because of exceptional circumstances—',
      },
      {
        number: '(a)',
        text: 'a student who does not make satisfactory progress for the first time under Rule 8 is assigned a progress status of "On Probation";',
      },
      {
        number: '(b)',
        text: 'a student who does not make satisfactory progress for the second time under Rule 8 is assigned a progress status of "Suspended";',
      },
      {
        number: '(c)',
        text: 'a student who does not make satisfactory progress for the third time under Rule 8 is assigned a progress status of "Excluded".',
      },
    ],
  },
  {
    title: 'Award with distinction rule',
    content: [
      {
        number: '12.',
        text: 'To be awarded the degree with distinction a student must achieve a course weighted average mark (WAM) of at least 80 per cent which is calculated based on—',
      },
      {
        number: '(a)',
        text: 'all units above Level 3 attempted as part of the course that are awarded a final percentage mark;',
      },
      {
        number: '(b)',
        text: 'all relevant units above Level 3 undertaken in articulating courses of this University that are awarded a final percentage mark;',
      },
      {
        number: 'and',
        text: '',
      },
      {
        number: '(c)',
        text: "all units above Level 3 completed at this University that are credited to the master's degree course.",
      },
    ],
  },
  {
    title: 'Deferral',
    content: [
      {
        number: '13.',
        text: 'Applicants awarded admission to the course are entitled to a deferral of up to 12 months, as per the University Policy on: Admissions (Coursework).',
      },
    ],
  },
]

config()

@Injectable()
export class DocumentsService {
  private readonly pdfDirectory = 'public/pdf'

  private readonly PDF_URL_PREFIX: string
  private readonly executablePath: string

  constructor() {
    if (!fs.existsSync(this.pdfDirectory)) {
      fs.mkdirSync(this.pdfDirectory, { recursive: true })
    }
    this.PDF_URL_PREFIX = process.env.PDF_URL_PREFIX
    this.executablePath = process.env.executablePath
    if (!this.PDF_URL_PREFIX) {
      throw new Error('PDF_URL_PREFIX is not defined in the environment variables')
    }
  }

  async generateCoursePDF(courseId: string): Promise<{ url: string }> {
    const fileName = `course_${courseId}_rules.pdf`
    const filePath = path.join(this.pdfDirectory, fileName)

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox'],
      ...(this.executablePath ? { executablePath: this.executablePath } : {}),
    })
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
