import React, { useState, useCallback } from 'react'
import { SortableTree, TreeItems } from 'dnd-kit-sortable-tree'
import { TreeItemComponent } from './TreeItemComponent'
import { Requirement } from './types'
import { initialViableRequirementData } from './initialData'

const SortableTreeComponent: React.FC = () => {
  const [items, setItems] = useState<TreeItems<Requirement>>(initialViableRequirementData)

  const handleItemsChange = useCallback((newItems: TreeItems<Requirement>) => {
    // 更新状态
    setItems(newItems)

    // 在这里你可以处理其他需要的更新逻辑，比如保存数据到服务器或者更新全局状态
    console.log('Updated items:', newItems)
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
