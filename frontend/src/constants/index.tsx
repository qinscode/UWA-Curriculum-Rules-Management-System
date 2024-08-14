import { Requirement } from '@/types'

export const numberingStyles = {
  numeric: (index: number, level: number) => (level === 1 ? `${index + 1}` : `(${index + 1})`),
  alphabetic: (index: number, level: number) =>
    level === 1 ? String.fromCharCode(97 + index) : `(${String.fromCharCode(97 + index)})`,
  roman: (index: number, level: number) => {
    const romanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x']
    return level === 1
      ? romanNumerals[index]
      : `(${romanNumerals[index] || (index + 1).toString()})`
  },
  none: () => '',
}
export const PRESET_RULES: Requirement[] = [
  {
    id: 1,
    level: 1,
    content: "A Bachelor's degree, or an equivalent qualification, as recognised by UWA;",
    style: 'numeric',
    children: [
      {
        id: 2,
        level: 2,
        content: 'the equivalent of a UWA weighted average mark of at least 50 per cent',
        style: 'alphabetic',
        children: [],
      },
      {
        id: 3,
        level: 2,
        content: 'at least two years professional experience in a relevant occupation;',
        style: 'alphabetic',
        children: [],
      },
    ],
  },
  {
    id: 4,
    level: 1,
    content: 'Completed one of the following at UWA:',
    style: 'numeric',
    children: [
      {
        id: 5,
        level: 2,
        content: 'Graduate Certificate in Finance',
        style: 'alphabetic',
        children: [],
      },
      {
        id: 6,
        level: 2,
        content: 'Graduate Certificate in Human Resources and Employment Relations',
        style: 'alphabetic',
        children: [],
      },
      {
        id: 7,
        level: 2,
        content: 'Graduate Certificate in Business Information and Logistics Management',
        style: 'alphabetic',
        children: [],
      },
      {
        id: 8,
        level: 2,
        content: 'Graduate Certificate in Commerce',
        style: 'alphabetic',
        children: [],
      },
      {
        id: 9,
        level: 2,
        content: 'Graduate Certificate in Marketing',
        style: 'alphabetic',
        children: [],
      },
      {
        id: 10,
        level: 2,
        content: 'Graduate Certificate in Economics',
        style: 'alphabetic',
        children: [],
      },
    ],
  },
]
