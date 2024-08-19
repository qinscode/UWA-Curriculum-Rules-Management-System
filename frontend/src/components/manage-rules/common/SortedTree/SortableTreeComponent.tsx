import React, { useState, useCallback, useEffect } from 'react'
import { TreeItems } from 'dnd-kit-sortable-tree'
import { NumberingStyle, TreeItemAdapter } from './types'
import { convertToTreeItemAdapter, updateItemsWithNumbers } from './utils'
import TreeView from './TreeView'
import { initialViableRequirementData } from './initialData'
import { TreeProvider } from './TreeContext'
import { UniqueIdentifier } from '@dnd-kit/core'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Requirement } from '@/types'

interface SortableTreeComponentProps {
  requirements: Requirement[]
}
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
          <div>
            <Label>Level 1 Style</Label>
            <Select onValueChange={(value) => handleStyleChange('level1', value as NumberingStyle)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select style" defaultValue={levelStyles.level1} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NumberingStyle.Numeric}>Numeric</SelectItem>
                <SelectItem value={NumberingStyle.Alphabetic}>Alphabetic</SelectItem>
                <SelectItem value={NumberingStyle.Roman}>Roman</SelectItem>
                <SelectItem value={NumberingStyle.None}>None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Level 2 Style</Label>
            <Select onValueChange={(value) => handleStyleChange('level2', value as NumberingStyle)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select style" defaultValue={levelStyles.level2} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NumberingStyle.Numeric}>Numeric</SelectItem>
                <SelectItem value={NumberingStyle.Alphabetic}>Alphabetic</SelectItem>
                <SelectItem value={NumberingStyle.Roman}>Roman</SelectItem>
                <SelectItem value={NumberingStyle.None}>None</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Level 3 Style</Label>
            <Select onValueChange={(value) => handleStyleChange('level3', value as NumberingStyle)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select style" defaultValue={levelStyles.level3} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NumberingStyle.Numeric}>Numeric</SelectItem>
                <SelectItem value={NumberingStyle.Alphabetic}>Alphabetic</SelectItem>
                <SelectItem value={NumberingStyle.Roman}>Roman</SelectItem>
                <SelectItem value={NumberingStyle.None}>None</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <TreeView items={items} onItemsChanged={handleItemsChange} />
      </div>
    </TreeProvider>
  )
}

export default SortableTreeComponent
