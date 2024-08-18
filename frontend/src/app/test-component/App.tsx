import React, { useState, useCallback, memo, forwardRef } from 'react'
import {
  SimpleTreeItemWrapper,
  SortableTree,
  TreeItemComponentProps,
  TreeItems,
} from 'dnd-kit-sortable-tree'

type MinimalTreeItemData = {
  value: string
}

// Define a type that matches the expected TreeItemComponentType
type TreeItemComponentType<T, N extends HTMLElement> = React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TreeItemComponentProps<T>> & React.RefAttributes<N>
>

const App: React.FC = () => {
  const [items, setItems] = useState<TreeItems<MinimalTreeItemData>>(initialViableMinimalData)

  const handleItemsChange = useCallback((newItems: TreeItems<MinimalTreeItemData>) => {
    setItems(newItems)
  }, [])

  return (
    <SortableTree items={items} onItemsChanged={handleItemsChange} TreeItemComponent={TreeItem} />
  )
}

const TreeItemComponent: TreeItemComponentType<MinimalTreeItemData, HTMLDivElement> = forwardRef(
  (props, ref) => {
    const [sample, setSample] = useState('')

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setSample(e.target.value)
    }, [])

    return (
      <SimpleTreeItemWrapper {...props} ref={ref}>
        <div>{props.item.value}</div>
        <input value={sample} onChange={handleInputChange} />
      </SimpleTreeItemWrapper>
    )
  }
)

TreeItemComponent.displayName = 'TreeItem'

const TreeItem = TreeItemComponent // No need for memo here as it's already included in the type

const initialViableMinimalData: TreeItems<MinimalTreeItemData> = [
  {
    id: 1,
    value: 'Jane',
    children: [
      { id: 4, value: 'John' },
      { id: 5, value: 'Sally' },
    ],
  },
  { id: 2, value: 'Fred', children: [{ id: 6, value: 'Eugene' }] },
  { id: 3, value: 'Helen' },
]

export default App
