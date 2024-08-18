import React, { useState, useCallback, forwardRef } from 'react'
import {
  SimpleTreeItemWrapper,
  SortableTree,
  TreeItemComponentProps,
  TreeItems,
} from 'dnd-kit-sortable-tree'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export interface Requirement {
  id: number
  level: number
  content: string
  children: Requirement[]
  style: string
  isConnector?: boolean
}

type TreeItemComponentType<T, N extends HTMLElement> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TreeItemComponentProps<T>> & React.RefAttributes<N>
>

const SortableTreeComponent: React.FC = () => {
  const [items, setItems] = useState<TreeItems<Requirement>>(initialViableRequirementData)

  const handleItemsChange = useCallback((newItems: TreeItems<Requirement>) => {
    setItems(newItems)
  }, [])

  return (
    <div className="p-4">
      <SortableTree items={items} onItemsChanged={handleItemsChange} TreeItemComponent={TreeItem} />
    </div>
  )
}

const TreeItemComponent: TreeItemComponentType<Requirement, HTMLDivElement> = forwardRef(
  (props, ref) => {
    const [content, setContent] = useState(props.item.content)
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setContent(e.target.value)
    }, [])

    return (
      <SimpleTreeItemWrapper {...props} ref={ref}>
        <Card className={`mb-2 ${props.item.style}`}>
          <div className="space-y-2 p-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Level {props.item.level}</Badge>
              {props.item.isConnector && <Badge variant="secondary">Connector</Badge>}
            </div>
            <Input
              value={content}
              onChange={handleInputChange}
              placeholder="Enter requirement content..."
              className="w-full"
            />
          </div>
        </Card>
      </SimpleTreeItemWrapper>
    )
  }
)

TreeItemComponent.displayName = 'TreeItem'

const TreeItem = TreeItemComponent

const initialViableRequirementData: TreeItems<Requirement> = [
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

export default SortableTreeComponent
