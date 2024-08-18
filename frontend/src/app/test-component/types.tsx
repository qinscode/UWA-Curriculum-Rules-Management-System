import { TreeItemComponentProps } from 'dnd-kit-sortable-tree'

export enum NumberingStyle {
  Numeric = 'numeric',
  Alphabetic = 'alphabetic',
  Roman = 'roman',
  None = 'none',
}

export interface Requirement {
  id: number
  level: number
  content: string
  style: NumberingStyle
  children: Requirement[]
  isConnector?: boolean
}

export type TreeItemComponentType<T, N extends HTMLElement> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TreeItemComponentProps<T>> & React.RefAttributes<N>
>
