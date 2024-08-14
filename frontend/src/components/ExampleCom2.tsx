import React, { useState, useCallback } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { Requirement } from '@/types'
import ControlPanel from './ControlPanel'
import HelpPanel from './HelpPanel'
import RequirementItem from './RequirementItem'
import { PRESET_RULES } from '@/constants'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'

const AdmissionRequirements: React.FC = () => {
  const [requirements, setRequirements] = useState<Requirement[]>([])
  const [styles, setStyles] = useState(['numeric', 'alphabetic', 'numeric'])
  const [showHelp, setShowHelp] = useState(false)

  const addRequirement = (parentId: number | null = null, level = 1) => {
    const newRequirement: Requirement = {
      id: Date.now(),
      level,
      content: '',
      children: [],
    }

    setRequirements((prevRequirements) => {
      if (!parentId) {
        return [...prevRequirements, newRequirement]
      }
      return updateNestedRequirements(prevRequirements, parentId, (parent) => ({
        ...parent,
        children: [...parent.children, newRequirement],
      }))
    })
  }

  const updateNestedRequirements = (
    reqs: Requirement[],
    id: number,
    updateFn: (req: Requirement) => Requirement
  ): Requirement[] => {
    return reqs.map((req) => {
      if (req.id === id) {
        return updateFn(req)
      }
      if (req.children.length > 0) {
        return {
          ...req,
          children: updateNestedRequirements(req.children, id, updateFn),
        }
      }
      return req
    })
  }

  const updateRequirement = (id: number, content: string) => {
    setRequirements((prevRequirements) =>
      updateNestedRequirements(prevRequirements, id, (req) => ({
        ...req,
        content,
      }))
    )
  }

  const removeRequirement = (id: number) => {
    setRequirements((prevRequirements) => {
      const removeNested = (reqs: Requirement[]): Requirement[] => {
        return reqs
          .filter((req) => req.id !== id)
          .map((req) => ({
            ...req,
            children: removeNested(req.children),
          }))
      }
      return removeNested(prevRequirements)
    })
  }

  const renderRequirement = useCallback(
    (req: Requirement, index: number, parentIndexes: number[] = []) => {
      return (
        <RequirementItem
          key={req.id}
          req={req}
          index={index}
          parentIndexes={parentIndexes}
          styles={styles}
          onUpdateRequirement={updateRequirement}
          onRemoveRequirement={removeRequirement}
          onAddRequirement={addRequirement}
          renderRequirement={renderRequirement}
        />
      )
    },
    [styles, updateRequirement, removeRequirement, addRequirement]
  )

  const handleStyleChange = (level: number, newStyle: string) => {
    setStyles((prevStyles) => {
      const newStyles = [...prevStyles]
      newStyles[level] = newStyle
      return newStyles
    })
  }

  const loadPresetRules = () => {
    setRequirements(PRESET_RULES)
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // Dropped outside the list
    if (!destination) {
      return
    }

    // If the item is dropped in the same position, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // If it's a top-level drag
    if (source.droppableId === 'main' && destination.droppableId === 'main') {
      const newRequirements = Array.from(requirements)
      const [reorderedItem] = newRequirements.splice(source.index, 1)
      newRequirements.splice(destination.index, 0, reorderedItem)
      setRequirements(newRequirements)
    } else {
      // It's a nested drag
      const sourceParentId = parseInt(source.droppableId)
      const destParentId = parseInt(destination.droppableId)

      setRequirements((prevRequirements) => {
        const updateChildren = (reqs: Requirement[]): Requirement[] => {
          return reqs.map((req) => {
            if (req.id === sourceParentId) {
              const newChildren = Array.from(req.children)
              const [reorderedItem] = newChildren.splice(source.index, 1)

              if (req.id === destParentId) {
                // Same parent, just reorder
                newChildren.splice(destination.index, 0, reorderedItem)
              }

              return { ...req, children: newChildren }
            }

            if (req.id === destParentId) {
              // Different parent
              const newChildren = Array.from(req.children)
              const sourceParent = reqs.find((r) => r.id === sourceParentId)
              const reorderedItem = sourceParent?.children[source.index]
              if (reorderedItem) {
                newChildren.splice(destination.index, 0, reorderedItem)
              }
              return { ...req, children: newChildren }
            }

            if (req.children.length > 0) {
              return { ...req, children: updateChildren(req.children) }
            }

            return req
          })
        }

        return updateChildren(prevRequirements)
      })
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="mx-auto max-w-3xl p-6">
        <h2 className="mb-6 text-2xl font-bold">Admission Requirements</h2>
        <ControlPanel
          styles={styles}
          onStyleChange={handleStyleChange}
          onToggleHelp={() => setShowHelp(!showHelp)}
          onLoadPreset={loadPresetRules}
        />
        <HelpPanel showHelp={showHelp} />
        <Droppable droppableId="main">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {requirements.map((req, index) => renderRequirement(req, index))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <button
          onClick={() => addRequirement()}
          className="mt-4 flex items-center rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Add Main Requirement
        </button>
      </div>
    </DragDropContext>
  )
}

export default AdmissionRequirements
