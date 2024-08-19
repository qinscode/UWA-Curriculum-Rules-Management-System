import { NumberingStyle, Requirement } from '@/types'

export const PRESET_RULES_Admissions: Requirement[] = [
  {
    id: 1,

    content: "A Bachelor's degree, or an equivalent qualification, as recognised by UWA;",
    style: NumberingStyle.Numeric,
    children: [
      {
        id: 2,
        content: 'the equivalent of a UWA weighted average mark of at least 50 per cent',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 3,
        content: 'at least two years professional experience in a relevant occupation;',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
    ],
  },
  {
    id: 4,

    content: 'Completed one of the following at UWA:',
    style: NumberingStyle.Numeric,
    children: [
      {
        id: 5,
        content: 'Graduate Certificate in Finance',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 6,
        content: 'Graduate Certificate in Human Resources and Employment Relations',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 7,
        content: 'Graduate Certificate in Business Information and Logistics Management',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 8,
        content: 'Graduate Certificate in Commerce',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 9,
        content: 'Graduate Certificate in Marketing',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 10,
        content: 'Graduate Certificate in Economics',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
    ],
  },
]

export const PRESET_RULES_ENGLISH: Requirement[] = [
  {
    id: 1,
    content:
      "To be considered eligible for consideration for admission to this course an applicant must satisfy the University's English language competence requirement as set out in the University Policy on Admission: Coursework.",
    style: NumberingStyle.Numeric,
    children: [],
  },
]

export const PRESET_RULES_RANKING_SELECTION: Requirement[] = [
  {
    id: 1,
    content:
      'Where relevant, admission will be awarded to the highest ranked applicants or applicants selected based on the relevant requirements.',
    style: NumberingStyle.Numeric,
    children: [],
  },
]

export const PRESET_RULES_ARTICULATION_AND_EXIT_AWARDS: Requirement[] = [
  {
    id: 1,
    content: 'This course has the following exit awards:',
    style: NumberingStyle.Numeric,
    children: [],
  },
  {
    id: 2,
    content: '60220 Graduate Certificate in Information Technology (24 points)',
    style: NumberingStyle.Numeric,
    children: [],
  },
  {
    id: 3,
    content: '60320 Graduate Diploma in Information Technology (48 points)',
    style: NumberingStyle.Numeric,
    children: [],
  },
  {
    id: 4,
    content:
      'A student who withdraws from the Master of Information Technology course before completing it, but after completing Level 4 and Level 5 units to the value of 24 points, may apply to the School to be awarded the Graduate Certificate in Information Technology.',
    style: NumberingStyle.Numeric,
    children: [],
  },
  {
    id: 5,
    content:
      'A student who withdraws from the Master of Information Technology course before completing it, but after completing Level 4 and Level 5 units to the value of 48 points, may apply to the School to be awarded the Graduate Diploma in Information Technology.',
    style: NumberingStyle.Numeric,
    children: [],
  },
]

export const COURSE_STRUCTURE: Requirement[] = [
  {
    id: 1,
    content:
      'The course consists of units to a total value of 96 points (maximum value) which include conversion units to a value of 24 points.',
    style: NumberingStyle.Numeric,
    children: [],
  },
  {
    id: 2,
    content:
      'Units must be selected in accordance with the course structure, as set out in these rules.',
    style: NumberingStyle.Numeric,
    children: [],
  },
  {
    id: 3,
    content:
      "Students who have completed a bachelor's degree with a major in a cognate area, or equivalent as recognised by the Faculty, are granted credit for conversion units up to a value of 24 points.",
    style: NumberingStyle.Numeric,
    children: [],
  },
]

export const SATISFACTORY_PROGRESS_RULE: Requirement[] = [
  {
    id: 1,
    content:
      'To make satisfactory progress a student must pass units to a point value greater than half the total value of units in which they remain enrolled after the final date for withdrawal without academic penalty.',
    style: NumberingStyle.Numeric,
    children: [],
  },
]

export const PROGRESS_STATUS: Requirement[] = [
  {
    id: 1,
    content:
      'A student who makes satisfactory progress in terms of Rule 8 is assigned the status of "Good Standing".',
    style: NumberingStyle.Numeric,
    children: [],
  },
  {
    id: 2,
    content: 'Unless the relevant board determines otherwise because of exceptional circumstances,',
    style: NumberingStyle.Numeric,
    children: [
      {
        id: 3,
        content:
          'a student who does not make satisfactory progress for the first time under Rule 8 is assigned a progress status of "On Probation";',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 4,
        content:
          'a student who does not make satisfactory progress for the second time under Rule 8 is assigned a progress status of "Suspended";',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 5,
        content:
          'a student who does not make satisfactory progress for the third time under Rule 8 is assigned a progress status of "Excluded".',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
    ],
  },
]

export const AWARD_WITH_DISTINCTION_RULE: Requirement[] = [
  {
    id: 1,
    content:
      'To be awarded the degree with distinction a student must achieve a course weighted average mark (WAM) of at least 80 per cent which is calculated based on—',
    style: NumberingStyle.Numeric,
    children: [
      {
        id: 2,
        content:
          'all units above Level 3 attempted as part of the course that are awarded a final percentage mark;',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 3,
        content:
          'all relevant units above Level 3 undertaken in articulating courses of this University that are awarded a final percentage mark;',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 4,
        content: 'and',
        style: NumberingStyle.None,
        children: [],
      },
      {
        id: 5,
        content:
          "all units above Level 3 completed at this University that are credited to the master's degree course.",
        style: NumberingStyle.Alphabetic,
        children: [],
      },
    ],
  },
]

export const DEFERRAL: Requirement[] = [
  {
    id: 1,
    content:
      'Applicants awarded admission to the course are entitled to a deferral of up to 12 months, as per the University Policy on: Admissions (Coursework).',
    style: NumberingStyle.Numeric,
    children: [],
  },
]
export const PRESET_RULES_BASE: Requirement[] = [
  {
    id: 1,
    content: '',
    style: NumberingStyle.Numeric,
    children: [],
  },
]
