import React, { useState, useCallback, useEffect } from 'react'
import { SortableTree, TreeItems } from 'dnd-kit-sortable-tree'
import { TreeItemComponent } from './TreeItemComponent'
import { Requirement, NumberingStyle } from './types'
import { initialViableRequirementData } from './initialData'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

// 用于生成编号的函数
const generateNumbering = (index: number, style: NumberingStyle): string => {
  switch (style) {
    case NumberingStyle.Numeric:
      return `${index}.`
    case NumberingStyle.Alphabetic:
      return String.fromCharCode(96 + index).toUpperCase() + '.'
    case NumberingStyle.Roman:
      const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
      return romanNumerals[index - 1] + '.'
    case NumberingStyle.None:
    default:
      return ''
  }
}

const SortableTreeComponent: React.FC = () => {
  const [levelStyles, setLevelStyles] = useState({
    level1: NumberingStyle.Numeric,
    level2: NumberingStyle.Alphabetic,
    level3: NumberingStyle.Roman,
  })

  const updateItemsWithNumbers = useCallback(
    (items: TreeItems<Requirement>, level = 1): TreeItems<Requirement> => {
      return items.map((item, index) => {
        const style =
          levelStyles[`level${level}` as keyof typeof levelStyles] || NumberingStyle.None
        return {
          ...item,
          numbering: generateNumbering(index + 1, style),
          children: updateItemsWithNumbers(item.children, level + 1),
        }
      })
    },
    [levelStyles]
  )

  const [items, setItems] = useState<TreeItems<Requirement>>(() => {
    // 初始化时生成编号
    return updateItemsWithNumbers(initialViableRequirementData)
  })

  const handleItemsChange = useCallback(
    (newItems: TreeItems<Requirement>) => {
      setItems(updateItemsWithNumbers(newItems))
    },
    [updateItemsWithNumbers]
  )

  const handleStyleChange = (level: string, style: NumberingStyle) => {
    setLevelStyles((prevStyles) => ({
      ...prevStyles,
      [level]: style,
    }))
    // 手动触发编号更新
    setItems(updateItemsWithNumbers(items))
  }

  useEffect(() => {
    setItems(updateItemsWithNumbers(items))
  }, [levelStyles, updateItemsWithNumbers])

  return (
    <div className="p-4">
      <div className="mb-4 flex space-x-4">
        <div>
          <Label>一级编号样式</Label>
          <Select onValueChange={(value) => handleStyleChange('level1', value as NumberingStyle)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择样式" />
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
          <Label>二级编号样式</Label>
          <Select onValueChange={(value) => handleStyleChange('level2', value as NumberingStyle)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择样式" />
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
          <Label>三级编号样式</Label>
          <Select onValueChange={(value) => handleStyleChange('level3', value as NumberingStyle)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="选择样式" />
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
