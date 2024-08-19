import { TreeItems } from 'dnd-kit-sortable-tree'
import { Requirement, NumberingStyle } from './types'

export const initialViableRequirementData: TreeItems<Requirement> = [
  {
    id: 1,
    content: "A Bachelor's degree, or an equivalent qualification, as recognised by UWA;",
    style: NumberingStyle.Numeric,
    children: [
      {
        id: 4,
        level: 2,
        content: 'the equivalent of a UWA weighted average mark of at least 50 per cent',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 5,
        level: 2,
        content: 'at least two years professional experience in a relevant occupation;',
        style: NumberingStyle.Roman,
        children: [],
      },
    ],
  },
  {
    id: 2,
    content: 'Completed one of the following at UWA:',
    style: NumberingStyle.Numeric,
    children: [
      {
        id: 6,
        level: 2,
        content: 'Graduate Certificate in Finance',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
    ],
  },
  {
    id: 3,
    content: 'Connector',
    style: NumberingStyle.None,
    children: [],
    isConnector: true,
  },
]
