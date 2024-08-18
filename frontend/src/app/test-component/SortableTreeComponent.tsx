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

const generateNumbering = (index: number, style: NumberingStyle): string => {
  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

  switch (style) {
    case NumberingStyle.Numeric:
      return `${index}.`
    case NumberingStyle.Alphabetic:
      return String.fromCharCode(96 + index).toUpperCase() + '.'
    case NumberingStyle.Roman:
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
    return updateItemsWithNumbers(initialViableRequirementData)
  })

  const handleItemsChange = useCallback(
    (newItems: TreeItems<Requirement>) => {
      setItems(updateItemsWithNumbers(newItems))
    },
    [updateItemsWithNumbers]
  )

  const handleAddChild = useCallback(
    (parentId: number) => {
      setItems((prevItems) => {
        const addItemToParent = (items: TreeItems<Requirement>): TreeItems<Requirement> => {
          return items.map((item) => {
            if (item.id === parentId) {
              const newChild = {
                id: Date.now(), // 生成一个唯一ID
                content: '新子项目',
                style: item.style,
                numbering: '', // 初始编号为空，稍后生成
                children: [],
              }
              const updatedItem = { ...item, children: [...item.children, newChild] }
              return updatedItem
            }
            return { ...item, children: addItemToParent(item.children) }
          })
        }
        const updatedItems = addItemToParent(prevItems)
        return updateItemsWithNumbers(updatedItems) // 立即更新编号
      })
    },
    [updateItemsWithNumbers]
  )

  const handleDelete = useCallback(
    (id: number) => {
      setItems((prevItems) => {
        const deleteItemById = (items: TreeItems<Requirement>): TreeItems<Requirement> => {
          return items
            .filter((item) => item.id !== id)
            .map((item) => ({
              ...item,
              children: deleteItemById(item.children),
            }))
        }
        const updatedItems = deleteItemById(prevItems)
        return updateItemsWithNumbers(updatedItems) // 立即更新编号
      })
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

  const handleContentChange = useCallback((id: number, newContent: string) => {
    setItems((prevItems) => {
      const updateContent = (items: TreeItems<Requirement>): TreeItems<Requirement> => {
        return items.map((item) => {
          if (item.id === id) {
            return { ...item, content: newContent }
          }
          return { ...item, children: updateContent(item.children) }
        })
      }
      return updateContent(prevItems)
    })
  }, [])

  return (
    <div className="p-4">
      <div className="mb-4 flex space-x-4">
        <div>
          <Label>一级编号样式</Label>
          <Select
            value={levelStyles.level1}
            onValueChange={(value) => handleStyleChange('level1', value as NumberingStyle)}
          >
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
          <Select
            value={levelStyles.level2}
            onValueChange={(value) => handleStyleChange('level2', value as NumberingStyle)}
          >
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
          <Select
            value={levelStyles.level3}
            onValueChange={(value) => handleStyleChange('level3', value as NumberingStyle)}
          >
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
        TreeItemComponent={(props) => (
          <TreeItemComponent
            {...props}
            onAddChild={handleAddChild}
            onDelete={handleDelete}
            onContentChange={handleContentChange} // 传递 onContentChange 方法
          />
        )}
      />
    </div>
  )
}

export default SortableTreeComponent
