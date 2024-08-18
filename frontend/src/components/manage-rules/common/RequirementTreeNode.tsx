import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Minus, Link } from 'lucide-react'
import { numberingStyles, RequirementTreeNodeProps } from '@/types'

const RequirementTreeNode: React.FC<RequirementTreeNodeProps> = ({
  req,
  index,
  parentIndexes,
  defaultStyles,
  onUpdateRequirement,
  onRemoveRequirement,
  onAddRequirement,
  onAddConnector,
  renderRequirementNode,
}) => {
  const fullIndex = [...parentIndexes, index]
  const numberingStyle = req.isConnector
    ? 'none'
    : (defaultStyles[req.level - 1] as keyof typeof numberingStyles)
  const prefix = numberingStyle === 'none' ? '' : numberingStyles[numberingStyle](index, req.level)

  const renderContent = () => (
    <div className="flex w-full items-center space-x-2">
      <div className="flex flex-grow items-center">
        {!req.isConnector && (
          <span className="mr-2 min-w-[30px] text-right font-semibold">{prefix}</span>
        )}
        <Input
          type="text"
          value={req.content}
          onChange={(e) => onUpdateRequirement(req.id, e.target.value)}
          className={req.isConnector ? 'ml-[30px] font-bold text-blue-600' : ''}
          placeholder={
            req.isConnector ? "Enter connector (e.g., 'and', 'or')" : 'Enter requirement'
          }
        />
      </div>
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => onRemoveRequirement(req.id)}
          variant="outline"
          size="icon"
          className="h-8 w-8"
        >
          <Minus className="h-4 w-4" />
        </Button>
        {!req.isConnector && req.level < 3 && (
          <Button
            onClick={() => onAddRequirement(req.id, req.level + 1)}
            variant="outline"
            size="icon"
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
        {req.level < 3 && (
          <Button
            onClick={() => onAddConnector(req.id, req.level + 1)}
            variant="outline"
            size="icon"
            className="h-8 w-8"
            title="Add Connector"
          >
            <Link className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )

  const content = <div className="mb-2">{renderContent()}</div>

  if (req.isConnector) {
    return content
  }

  return (
    <Draggable draggableId={req.id.toString()} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {content}
          {req.children.length > 0 && (
            <Droppable droppableId={req.id.toString()}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="ml-8 mt-2">
                  {req.children.map((child, childIndex) =>
                    renderRequirementNode(child, childIndex, fullIndex)
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          )}
        </div>
      )}
    </Draggable>
  )
}

export default RequirementTreeNode
