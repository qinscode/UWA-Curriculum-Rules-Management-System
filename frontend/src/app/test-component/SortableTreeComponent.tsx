import React, { useState, useCallback } from 'react'
import { SortableTree, TreeItems } from 'dnd-kit-sortable-tree'
import { TreeItemComponent } from './TreeItemComponent'
import { Requirement } from './types'
import { initialViableRequirementData } from './initialData'

const SortableTreeComponent: React.FC = () => {
  const [items, setItems] = useState<TreeItems<Requirement>>(initialViableRequirementData)

  const handleItemsChange = useCallback((newItems: TreeItems<Requirement>) => {
    setItems(newItems)
  }, [])

  return (
    <div className="p-4">
      <SortableTree
        items={items}
        onItemsChanged={handleItemsChange}
        TreeItemComponent={TreeItemComponent}
      />
    </div>
  )
}

export default SortableTreeComponent
