import { UniqueIdentifier } from '@dnd-kit/core'

export enum NumberingStyle {
  Numeric = 'numeric',
  Alphabetic = 'alphabetic',
  Roman = 'roman',
  None = 'none',
}

export interface Requirement {
  id: number
  content: string
  style: NumberingStyle
  numbering?: string
  children: Requirement[]
  isConnector?: boolean
}

export interface TreeItemAdapterExtra {
  id: UniqueIdentifier
  children: TreeItemAdapter[]
  collapsed?: boolean
  canHaveChildren?: boolean
  disableSorting?: boolean
}

export type TreeItemAdapter = Omit<Requirement, 'id' | 'children'> & TreeItemAdapterExtra
