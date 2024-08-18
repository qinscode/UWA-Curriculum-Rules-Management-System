import { TreeItems } from 'dnd-kit-sortable-tree'
import { Requirement } from './types'

export const initialViableRequirementData: TreeItems<Requirement> = [
  {
    id: 1,
    level: 1,
    content: 'Main Requirement',
    style: 'border-blue-200',
    children: [
      { id: 4, level: 2, content: 'Sub-requirement 1', style: 'border-green-200', children: [] },
      { id: 5, level: 2, content: 'Sub-requirement 2', style: 'border-green-200', children: [] },
    ],
  },
  {
    id: 2,
    level: 1,
    content: 'Another Requirement',
    style: 'border-blue-200',
    children: [
      { id: 6, level: 2, content: 'Sub-requirement 3', style: 'border-green-200', children: [] },
    ],
  },
  {
    id: 3,
    level: 1,
    content: 'Connector',
    style: 'border-yellow-200',
    children: [],
    isConnector: true,
  },
]
