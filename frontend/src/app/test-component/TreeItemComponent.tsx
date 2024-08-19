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
      // Update the item in the parent component's state
      props.item.content = e.target.value
    }

    const handleBlur = () => {
      // Ensure the parent component's state is updated when the input loses focus
      props.item.content = content
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
              />
            </div>
          </div>
        </Card>
      </SimpleTreeItemWrapper>
    )
  }
)

TreeItemComponent.displayName = 'TreeItem'
