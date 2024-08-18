import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import RequirementTreeNode from './RequirementTreeNode'
import { Requirement } from '@/types'

interface RequirementTreeViewProps {
  requirements: Requirement[]
  defaultStyles: string[]
  onUpdateRequirement: (id: number, content: string) => void
  onRemoveRequirement: (id: number) => void
  onAddRequirement: (parentId: number | null, level: number) => void
  onAddConnector: (parentId: number, level: number) => void
}

const RequirementTreeView: React.FC<RequirementTreeViewProps> = ({
  requirements,
  defaultStyles,
  onUpdateRequirement,
  onRemoveRequirement,
  onAddRequirement,
  onAddConnector,
}) => {
  const renderRequirementNode = (req: Requirement, index: number, parentIndexes: number[] = []) => {
    return (
      <RequirementTreeNode
        key={req.id}
        req={req}
        index={index}
        parentIndexes={parentIndexes}
        defaultStyles={defaultStyles}
        onUpdateRequirement={onUpdateRequirement}
        onRemoveRequirement={onRemoveRequirement}
        onAddRequirement={onAddRequirement}
        onAddConnector={onAddConnector}
        renderRequirementNode={renderRequirementNode}
      />
    )
  }

  return (
    <Droppable droppableId="main">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {requirements.map((req, index) => renderRequirementNode(req, index))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  )
}

export default RequirementTreeView
