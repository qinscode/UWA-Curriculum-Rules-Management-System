import React, { useState, useCallback, forwardRef } from 'react'
import { SortableTree, TreeItems } from 'dnd-kit-sortable-tree'
import { TreeItemComponentProps, SimpleTreeItemWrapper } from 'dnd-kit-sortable-tree'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
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
import { Button } from '@/components/ui/button'

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

// TreeItemComponent
interface ExtendedTreeItemComponentProps extends TreeItemComponentProps<Requirement> {
  onDelete: (id: number) => void
  onAddChild: (parentId: number) => void
}

export const TreeItemComponent = forwardRef<HTMLDivElement, ExtendedTreeItemComponentProps>(
  (props, ref) => {
    const { item, depth, onDelete, onAddChild } = props

    const handleAddChild = (event: React.MouseEvent) => {
      event.stopPropagation() // 阻止事件冒泡
      onAddChild(item.id)
    }

    const handleDelete = (event: React.MouseEvent) => {
      event.stopPropagation() // 阻止事件冒泡
      onDelete(item.id)
    }

    return (
      <SimpleTreeItemWrapper {...props} ref={ref}>
        <Card className={`mb-2 shadow-sm transition-shadow duration-200 hover:shadow-md`}>
          <div className="flex items-center justify-between space-y-2 p-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="whitespace-nowrap bg-primary/10 text-primary">
                {item.numbering}
              </Badge>
              <Input
                value={item.content}
                placeholder="Enter requirement content..."
                className="flex-grow"
                readOnly
              />
            </div>
            <div className="space-x-2">
              {depth < 3 && (
                <Button onClick={handleAddChild} variant="outline" size="sm">
                  添加子项目
                </Button>
              )}
              <Button onClick={handleDelete} variant="destructive" size="sm">
                删除
              </Button>
            </div>
          </div>
        </Card>
      </SimpleTreeItemWrapper>
    )
  }
)

TreeItemComponent.displayName = 'TreeItem'
