import React from 'react'
import { SortableTree, TreeItems } from 'dnd-kit-sortable-tree'
import { TreeItemComponent } from './TreeItemComponent'
import { TreeItemAdapter } from './types'

interface TreeViewProps {
  items: TreeItemAdapter[]
  onItemsChanged: (newItems: TreeItems<TreeItemAdapter>) => void
}

const TreeView: React.FC<TreeViewProps> = ({ items, onItemsChanged }) => {
  return (
    <SortableTree
      items={items}
      onItemsChanged={onItemsChanged}
      TreeItemComponent={TreeItemComponent}
      dropAnimation={{ duration: 150 }}
    />
  )
}

export default TreeView
