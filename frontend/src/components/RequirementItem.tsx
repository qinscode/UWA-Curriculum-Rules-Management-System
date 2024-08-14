import React from 'react'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid'
import { Requirement, numberingStyles } from '@/types'

interface RequirementItemProps {
  req: Requirement
  index: number
  parentIndexes: number[]
  defaultStyles: string[]
  onUpdateRequirement: (id: number, content: string) => void
  onRemoveRequirement: (id: number) => void
  onAddRequirement: (parentId: number | null, level: number) => void
  renderRequirement: (req: Requirement, index: number, parentIndexes: number[]) => React.ReactNode
}

const RequirementItem: React.FC<RequirementItemProps> = ({
  req,
  index,
  parentIndexes,
  defaultStyles,
  onUpdateRequirement,
  onRemoveRequirement,
  onAddRequirement,
  renderRequirement,
}) => {
  const fullIndex = [...parentIndexes, index]
  const numberingStyle = defaultStyles[req.level - 1] as keyof typeof numberingStyles
  const prefix = numberingStyle === 'none' ? '' : numberingStyles[numberingStyle](index, req.level)

  return (
    <Draggable draggableId={req.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2"
        >
          <div className="flex items-center space-x-2">
            <span className="min-w-[30px] text-right font-semibold">{prefix}</span>
            <input
              type="text"
              value={req.content}
              onChange={(e) => onUpdateRequirement(req.id, e.target.value)}
              className="flex-grow rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter requirement"
            />
            <button
              onClick={() => onRemoveRequirement(req.id)}
              className="p-2 text-red-600 hover:text-red-800 focus:outline-none"
            >
              <MinusIcon className="h-5 w-5" />
            </button>
            {req.level < 3 && (
              <button
                onClick={() => onAddRequirement(req.id, req.level + 1)}
                className="p-2 text-green-600 hover:text-green-800 focus:outline-none"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          {req.children.length > 0 && (
            <Droppable droppableId={req.id.toString()}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="ml-8 mt-2">
                  {req.children.map((child, childIndex) =>
                    renderRequirement(child, childIndex, fullIndex)
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

export default RequirementItem
