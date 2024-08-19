import React, { forwardRef, useState, useEffect } from 'react'
import { SimpleTreeItemWrapper, TreeItemComponentProps } from 'dnd-kit-sortable-tree'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlusCircle, Trash2 } from 'lucide-react'
import { NumberingStyle, TreeItemAdapter } from './types'
import { useTreeContext } from './TreeContext'

export const TreeItemComponent = forwardRef<
  HTMLDivElement,
  TreeItemComponentProps<TreeItemAdapter>
>((props, ref) => {
  const { item, onRemove } = props

  const [content, setContent] = useState(item.content)
  const { refreshTree } = useTreeContext()

  useEffect(() => {
    setContent(item.content)
  }, [item.content])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value)
    item.content = e.target.value
  }

  const handleBlur = () => {
    item.content = content
  }

  const handleInputClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleAddChild = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newChild: TreeItemAdapter = {
      id: Date.now().toString(),
      content: 'New Child Item',
      style: NumberingStyle.Numeric,
      children: [],
    }
    item.children.push(newChild)
    refreshTree()
    // if (onCollapse) {
    //   onCollapse()
    // }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onRemove) {
      onRemove()
    }
  }

  return (
    <SimpleTreeItemWrapper {...props} ref={ref}>
      <Card className={`mb-2 shadow-sm transition-shadow duration-200 hover:shadow-md`}>
        <div className="space-y-2 p-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="whitespace-nowrap bg-primary/10 text-primary">
              {item.numbering}
            </Badge>
            <Input
              value={content}
              placeholder="Enter requirement content..."
              className="flex-grow"
              onChange={handleChange}
              onBlur={handleBlur}
              onClick={handleInputClick}
            />
            <Button variant="ghost" size="icon" onClick={handleAddChild} title="Add Child Item">
              <PlusCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete Item">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </SimpleTreeItemWrapper>
  )
})

TreeItemComponent.displayName = 'TreeItem'
