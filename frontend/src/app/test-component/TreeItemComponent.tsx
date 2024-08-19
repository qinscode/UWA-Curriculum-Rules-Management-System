import React, { forwardRef, useState, useEffect } from 'react'
import { SimpleTreeItemWrapper, TreeItemComponentProps } from 'dnd-kit-sortable-tree'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { NumberingStyle, Requirement } from './types'

export const TreeItemComponent = forwardRef<HTMLDivElement, TreeItemComponentProps<Requirement>>(
  (props, ref) => {
    const [content, setContent] = useState(props.item.content)

    useEffect(() => {
      setContent(props.item.content)
    }, [props.item.content])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setContent(e.target.value)
      props.item.content = e.target.value
    }

    const handleBlur = () => {
      props.item.content = content
    }

    const handleInputClick = (e: React.MouseEvent) => {
      // fix for input click propagation
      e.stopPropagation()
    }

    return (
      <SimpleTreeItemWrapper {...props} ref={ref}>
        <Card className={`mb-2 shadow-sm transition-shadow duration-200 hover:shadow-md`}>
          <div className="space-y-2 p-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="whitespace-nowrap bg-primary/10 text-primary">
                {props.item.numbering}
              </Badge>
              <Input
                value={content}
                placeholder="Enter requirement content..."
                className="flex-grow"
                onChange={handleChange}
                onBlur={handleBlur}
                onClick={handleInputClick}
              />
            </div>
          </div>
        </Card>
      </SimpleTreeItemWrapper>
    )
  }
)

TreeItemComponent.displayName = 'TreeItem'
