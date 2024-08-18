import React, { useState, useCallback, forwardRef } from 'react'
import { SimpleTreeItemWrapper, TreeItemComponentProps } from 'dnd-kit-sortable-tree'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Requirement } from './types'

export const TreeItemComponent = forwardRef<HTMLDivElement, TreeItemComponentProps<Requirement>>(
  (props, ref) => {
    const [content, setContent] = useState(props.item.content)
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setContent(e.target.value)
    }, [])

    return (
      <SimpleTreeItemWrapper {...props} ref={ref}>
        <Card className={`mb-2 ${props.item.style}`}>
          <div className="space-y-2 p-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Level {props.item.level}</Badge>
              {props.item.isConnector && <Badge variant="secondary">Connector</Badge>}
            </div>
            <Input
              value={content}
              onChange={handleInputChange}
              placeholder="Enter requirement content..."
              className="w-full"
            />
          </div>
        </Card>
      </SimpleTreeItemWrapper>
    )
  }
)

TreeItemComponent.displayName = 'TreeItem'
