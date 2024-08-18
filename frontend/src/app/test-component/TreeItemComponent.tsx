import React, { useState, useCallback, forwardRef } from 'react'
import { SimpleTreeItemWrapper, TreeItemComponentProps } from 'dnd-kit-sortable-tree'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Requirement, NumberingStyle } from './types'

export const TreeItemComponent = forwardRef<HTMLDivElement, TreeItemComponentProps<Requirement>>(
  (props, ref) => {
    const [content, setContent] = useState(props.item.content)

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      setContent(e.target.value)
      console.log('content:', props.item)
    }, [])

    const getNumbering = (level: number, style: NumberingStyle) => {
      const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

      switch (style) {
        case NumberingStyle.Numeric:
          return `${level}.`
        case NumberingStyle.Alphabetic:
          return String.fromCharCode(96 + level).toUpperCase() + '.'
        case NumberingStyle.Roman:
          return romanNumerals[level - 1] + '.'
        case NumberingStyle.None:
        default:
          return ''
      }
    }

    return (
      <SimpleTreeItemWrapper {...props} ref={ref}>
        <Card className={`mb-2 shadow-sm transition-shadow duration-200 hover:shadow-md`}>
          <div className="space-y-2 p-4">
            <div className="flex items-center space-x-2">
              {!props.item.isConnector && (
                <Badge variant="outline" className="whitespace-nowrap bg-primary/10 text-primary">
                  {getNumbering(props.item.level, props.item.style)} Level {props.item.level}
                </Badge>
              )}
              <Input
                value={content}
                onChange={handleInputChange}
                placeholder="Enter requirement content..."
                className="flex-grow"
              />
            </div>
          </div>
        </Card>
      </SimpleTreeItemWrapper>
    )
  }
)

TreeItemComponent.displayName = 'TreeItem'
