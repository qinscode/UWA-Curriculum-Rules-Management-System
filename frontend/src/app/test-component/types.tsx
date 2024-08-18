import { TreeItemComponentProps } from 'dnd-kit-sortable-tree'

export interface Requirement {
  id: number
  level: number
  content: string
  children: Requirement[]
  style: string
  isConnector?: boolean
}

export type TreeItemComponentType<T, N extends HTMLElement> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TreeItemComponentProps<T>> & React.RefAttributes<N>
>
