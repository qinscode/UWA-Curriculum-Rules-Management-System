import React, { useState, useCallback, useEffect } from 'react'
import { TreeItems } from 'dnd-kit-sortable-tree'
import { NumberingStyle, TreeItemAdapter } from './types'
import { convertToTreeItemAdapter, updateItemsWithNumbers } from './utils'
import TreeView from './TreeView'
import { initialViableRequirementData } from './initialData'
import { TreeProvider } from './TreeContext'
import { UniqueIdentifier } from '@dnd-kit/core'
import LevelStyleSelector from './LevelStyleSelector'

const SortableTreeComponent: React.FC = () => {
  const [levelStyles, setLevelStyles] = useState({
    level1: NumberingStyle.Numeric,
    level2: NumberingStyle.Alphabetic,
    level3: NumberingStyle.Roman,
  })

  const [items, setItems] = useState<TreeItemAdapter[]>(() => {
    const adaptedItems = convertToTreeItemAdapter(initialViableRequirementData)
    return updateItemsWithNumbers(adaptedItems, levelStyles)
  })

  const handleItemsChange = useCallback(
    (newItems: TreeItems<TreeItemAdapter>) => {
      setItems(updateItemsWithNumbers(newItems, levelStyles))
    },
    [levelStyles]
  )

  const handleStyleChange = useCallback((level: string, style: NumberingStyle) => {
    setLevelStyles((prevStyles) => {
      const newStyles = { ...prevStyles, [level]: style }
      setItems((prevItems) => updateItemsWithNumbers(prevItems, newStyles))
      return newStyles
    })
  }, [])

  const refreshTree = useCallback(() => {
    setItems((prevItems) => updateItemsWithNumbers(prevItems, levelStyles))
  }, [levelStyles])

  useEffect(() => {
    refreshTree()
  }, [levelStyles, refreshTree])

  const toggleConnector = useCallback((id: UniqueIdentifier) => {
    setItems((prevItems) => {
      const toggleItem = (items: TreeItemAdapter[]): TreeItemAdapter[] => {
        return items.map((item) => {
          if (item.id === id) {
            return { ...item, isConnector: !item.isConnector }
          }
          if (item.children.length > 0) {
            return { ...item, children: toggleItem(item.children) }
          }
          return item
        })
      }
      return toggleItem(prevItems)
    })
  }, [])

  return (
    <TreeProvider onRefresh={refreshTree} onToggleConnector={toggleConnector}>
      <div className="p-4">
        <div className="mb-4 flex space-x-4">
          <LevelStyleSelector level="1" value={levelStyles.level1} onChange={handleStyleChange} />
          <LevelStyleSelector level="2" value={levelStyles.level2} onChange={handleStyleChange} />
          <LevelStyleSelector level="3" value={levelStyles.level3} onChange={handleStyleChange} />
        </div>
        <TreeView items={items} onItemsChanged={handleItemsChange} />
      </div>
    </TreeProvider>
  )
}

export default SortableTreeComponent
