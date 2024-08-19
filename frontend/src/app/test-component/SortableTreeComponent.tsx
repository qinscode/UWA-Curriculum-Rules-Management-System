import React, { useState, useCallback, useEffect } from 'react'
import { TreeItems } from 'dnd-kit-sortable-tree'
import { NumberingStyle, TreeItemAdapter } from './types'
import { convertToTreeItemAdapter, updateItemsWithNumbers } from './utils'
import NumberingStyleSelector from './NumberingStyleSelector'
import TreeView from './TreeView'
import { initialViableRequirementData } from './initialData'

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

  const handleStyleChange = (level: string, style: NumberingStyle) => {
    setLevelStyles((prevStyles) => ({
      ...prevStyles,
      [level]: style,
    }))
  }

  useEffect(() => {
    setItems(updateItemsWithNumbers(items, levelStyles))
  }, [levelStyles])

  return (
    <div className="p-4">
      <div className="mb-4 flex space-x-4">
        {Object.entries(levelStyles).map(([level, style]) => (
          <NumberingStyleSelector
            key={level}
            level={level.replace('level', '')}
            value={style}
            onChange={handleStyleChange}
          />
        ))}
      </div>
      <TreeView items={items} onItemsChanged={handleItemsChange} />
    </div>
  )
}

export default SortableTreeComponent
