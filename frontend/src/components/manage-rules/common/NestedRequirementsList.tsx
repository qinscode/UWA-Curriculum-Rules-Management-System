import React, { useState, useCallback, useMemo } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd'
import ControlPanel from './ControlPanel'
import HelpPanel from './HelpPanel'
import RequirementItem from './RequirementItem'
import { NestedRequirementsListProps, Requirement } from '@/types'

const NestedRequirementsList: React.FC<NestedRequirementsListProps> = ({
  initialRequirements = [],
  onChange,
  defaultStyles: propDefaultStyles = ['numeric', 'alphabetic', 'numeric'],
  showControls = true,
  showHelpPanel = true,
  addMainButtonText = 'Add Main Requirement',
  presetRules = [],
}) => {
  const [requirements, setRequirements] = useState<Requirement[]>(initialRequirements)
  const [defaultStyles, setDefaultStyles] = useState(propDefaultStyles)
  const [showHelp, setShowHelp] = useState(false)

  const updateNestedRequirements = useCallback(
    (
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
    },
    []
  )

  const updateRequirements = useCallback(
    (newRequirements: Requirement[]) => {
      setRequirements(newRequirements)
      onChange?.(newRequirements)
    },
    [onChange]
  )

  const addRequirement = useCallback(
    (parentId: number | null = null, level = 1) => {
      const newRequirement: Requirement = {
        id: Date.now(),
        level,
        content: '',
        children: [],
        style: defaultStyles[level - 1],
        isConnector: false,
      }

      setRequirements((prevRequirements) => {
        const updatedRequirements = parentId
          ? updateNestedRequirements(prevRequirements, parentId, (parent) => ({
              ...parent,
              children: [...parent.children, newRequirement],
            }))
          : [...prevRequirements, newRequirement]

        onChange?.(updatedRequirements)
        return updatedRequirements
      })
    },
    [defaultStyles, onChange, updateNestedRequirements]
  )

  const updateRequirement = useCallback(
    (id: number, content: string) => {
      setRequirements((prevRequirements) => {
        const updatedRequirements = updateNestedRequirements(prevRequirements, id, (req) => ({
          ...req,
          content,
        }))
        onChange?.(updatedRequirements)
        return updatedRequirements
      })
    },
    [onChange, updateNestedRequirements]
  )

  const removeRequirement = useCallback(
    (id: number) => {
      setRequirements((prevRequirements) => {
        const removeNested = (reqs: Requirement[]): Requirement[] => {
          return reqs
            .filter((req) => req.id !== id)
            .map((req) => ({
              ...req,
              children: removeNested(req.children),
            }))
        }
        const updatedRequirements = removeNested(prevRequirements)
        onChange?.(updatedRequirements)
        return updatedRequirements
      })
    },
    [onChange]
  )

  const addConnector = useCallback(
    (parentId: number, level: number) => {
      const newConnector: Requirement = {
        id: Date.now(),
        level,
        content: 'and',
        children: [],
        style: 'none',
        isConnector: true,
      }

      setRequirements((prevRequirements) => {
        const updatedRequirements = updateNestedRequirements(
          prevRequirements,
          parentId,
          (parent) => ({
            ...parent,
            children: [...parent.children, newConnector],
          })
        )
        onChange?.(updatedRequirements)
        return updatedRequirements
      })
    },
    [onChange, updateNestedRequirements]
  )

  const renderRequirement = useCallback(
    (req: Requirement, index: number, parentIndexes: number[] = []) => {
      return (
        <RequirementItem
          key={req.id}
          req={req}
          index={index}
          parentIndexes={parentIndexes}
          defaultStyles={defaultStyles}
          onUpdateRequirement={updateRequirement}
          onRemoveRequirement={removeRequirement}
          onAddRequirement={addRequirement}
          onAddConnector={addConnector}
          renderRequirement={renderRequirement}
        />
      )
    },
    [defaultStyles, updateRequirement, removeRequirement, addRequirement, addConnector]
  )

  const handleDefaultStyleChange = useCallback((level: number, newStyle: string) => {
    setDefaultStyles((prevStyles) => {
      const newStyles = [...prevStyles]
      newStyles[level - 1] = newStyle
      return newStyles
    })
  }, [])

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result

      if (!destination) {
        return
      }

      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return
      }

      setRequirements((prevRequirements) => {
        const updateChildren = (reqs: Requirement[]): Requirement[] => {
          if (source.droppableId === 'main' && destination.droppableId === 'main') {
            const newReqs = Array.from(reqs)
            const [removed] = newReqs.splice(source.index, 1)
            newReqs.splice(destination.index, 0, removed)
            return newReqs
          }

          return reqs.map((req) => {
            if (req.id.toString() === source.droppableId) {
              const newChildren = Array.from(req.children)
              const [removed] = newChildren.splice(source.index, 1)
              if (req.id.toString() === destination.droppableId) {
                newChildren.splice(destination.index, 0, removed)
              }
              return { ...req, children: newChildren }
            }

            if (req.id.toString() === destination.droppableId) {
              const newChildren = Array.from(req.children)
              const sourceReq = reqs.find((r) => r.id.toString() === source.droppableId)
              if (sourceReq) {
                const [removed] = sourceReq.children.splice(source.index, 1)
                newChildren.splice(destination.index, 0, removed)
              }
              return { ...req, children: newChildren }
            }

            if (req.children.length > 0) {
              return { ...req, children: updateChildren(req.children) }
            }

            return req
          })
        }

        const updatedRequirements = updateChildren(prevRequirements)
        onChange?.(updatedRequirements)
        return updatedRequirements
      })
    },
    [onChange]
  )

  const loadPresetRules = useCallback(() => {
    const updatedPresetRules = presetRules.map((rule) => ({
      ...rule,
      style: rule.style || defaultStyles[rule.level - 1] || 'numeric',
      isConnector: rule.isConnector || false,
    }))
    updateRequirements(updatedPresetRules)
  }, [presetRules, defaultStyles, updateRequirements])

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="py-6">
        {showControls && (
          <ControlPanel
            defaultStyles={defaultStyles}
            onDefaultStyleChange={handleDefaultStyleChange}
            onToggleHelp={() => setShowHelp(!showHelp)}
            onLoadPreset={loadPresetRules}
          />
        )}
        {showHelpPanel && <HelpPanel showHelp={showHelp} />}
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
          {addMainButtonText}
        </button>
      </div>
    </DragDropContext>
  )
}

export default NestedRequirementsList
