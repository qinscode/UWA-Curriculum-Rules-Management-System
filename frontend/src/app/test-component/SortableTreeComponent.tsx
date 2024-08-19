import React, { useState, useCallback, useEffect } from 'react'
import { SortableTree, TreeItems } from 'dnd-kit-sortable-tree'
import { TreeItemComponent } from './TreeItemComponent'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { UniqueIdentifier } from '@dnd-kit/core'

// Type definitions
export enum NumberingStyle {
  Numeric = 'numeric',
  Alphabetic = 'alphabetic',
  Roman = 'roman',
  None = 'none',
}

export interface Requirement {
  id: number
  content: string
  style: NumberingStyle
  numbering?: string
  children: Requirement[]
  isConnector?: boolean
}

export interface TreeItemAdapterExtra {
  id: UniqueIdentifier
  children: TreeItemAdapter[]
  collapsed?: boolean
  canHaveChildren?: boolean
  disableSorting?: boolean
}

export type TreeItemAdapter = Omit<Requirement, 'id' | 'children'> & TreeItemAdapterExtra

// Helper functions
const generateNumbering = (index: number, style: NumberingStyle): string => {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

  switch (style) {
    case NumberingStyle.Numeric:
      return `${index + 1}.`
    case NumberingStyle.Alphabetic:
      return String.fromCharCode(97 + index).toUpperCase() + '.'
    case NumberingStyle.Roman:
      return romanNumerals[index] + '.'
    case NumberingStyle.None:
    default:
      return ''
  }
}

const convertToTreeItemAdapter = (requirements: Requirement[]): TreeItemAdapter[] => {
  return requirements.map((req) => ({
    ...req,
    id: req.id.toString(), // Convert number to string for UniqueIdentifier
    children: convertToTreeItemAdapter(req.children),
    canHaveChildren: true,
    disableSorting: false,
  }))
}

const updateItemsWithNumbers = (
  items: TreeItemAdapter[],
  levelStyles: Record<string, NumberingStyle>,
  level = 1,
  parentNumbering = ''
): TreeItemAdapter[] => {
  return items.map((item, index) => {
    const style = levelStyles[`level${level}`] || NumberingStyle.None
    const currentNumbering = generateNumbering(index, style)
    const fullNumbering = parentNumbering
      ? `${parentNumbering}${currentNumbering}`
      : currentNumbering

    return {
      ...item,
      numbering: fullNumbering,
      children: updateItemsWithNumbers(item.children, levelStyles, level + 1, fullNumbering),
    }
  })
}

// Initial data (you might want to replace this with your actual initial data)
const initialViableRequirementData: Requirement[] = [
  {
    id: 1,
    content: 'Root Requirement 1',
    style: NumberingStyle.Numeric,
    children: [
      {
        id: 2,
        content: 'Child Requirement 1.1',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
      {
        id: 3,
        content: 'Child Requirement 1.2',
        style: NumberingStyle.Alphabetic,
        children: [],
      },
    ],
  },
  {
    id: 4,
    content: 'Root Requirement 2',
    style: NumberingStyle.Numeric,
    children: [],
  },
]

// Main component
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
        <div>
          <Label>Level 1 Numbering Style</Label>
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
          <Label>Level 2 Numbering Style</Label>
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
          <Label>Level 3 Numbering Style</Label>
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
      <SortableTree
        items={items}
        onItemsChanged={handleItemsChange}
        TreeItemComponent={TreeItemComponent}
      />
    </div>
  )
}

export default SortableTreeComponent
