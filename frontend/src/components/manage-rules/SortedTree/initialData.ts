import { Requirement, NumberingStyle } from '@/types'

export const initialViableRequirementData: Requirement[] = [
  {
    id: 1,
    content: 'Root Requirement 1',
    style: NumberingStyle.Numeric,
    children: [
      {
        id: 2,
        content: 'Child Requirement 1.1',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 3,
        content: 'Child Requirement 1.2',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
    ],
  },
  {
    id: 4,
    content: 'Root Requirement 2',
    style: NumberingStyle.Numeric,
    children: [],
  },
]
