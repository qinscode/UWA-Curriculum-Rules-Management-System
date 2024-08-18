import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { PlusIcon, MinusIcon, LinkIcon } from '@heroicons/react/20/solid'
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
    <div className="flex w-full items-center">
      <div className="flex flex-grow items-center">
        {!req.isConnector && (
          <span className="mr-2 min-w-[30px] text-right font-semibold">{prefix}</span>
        )}
        <input
          type="text"
          value={req.content}
          onChange={(e) => onUpdateRequirement(req.id, e.target.value)}
          className={`flex-grow rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            req.isConnector ? 'ml-[30px] font-bold text-blue-600' : ''
          }`}
          placeholder={
            req.isConnector ? "Enter connector (e.g., 'and', 'or')" : 'Enter requirement'
          }
        />
      </div>
      <div className="ml-2 flex items-center space-x-2">
        <button
          onClick={() => onRemoveRequirement(req.id)}
          className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
        >
          <MinusIcon className="h-5 w-5" />
        </button>
        {!req.isConnector && req.level < 3 && (
          <button
            onClick={() => onAddRequirement(req.id, req.level + 1)}
            className="p-2 text-green-600 hover:text-green-800 focus:outline-none"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        )}
        {req.level < 3 && (
          <button
            onClick={() => onAddConnector(req.id, req.level + 1)}
            className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            title="Add Connector"
          >
            <LinkIcon className="h-5 w-5" />
          </button>
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
