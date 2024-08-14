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
  const [defaultStyles, setDefaultStyles] = useState(['numeric', 'alphabetic', 'numeric'])
  const [showHelp, setShowHelp] = useState(false)

  const addRequirement = (parentId: number | null = null, level = 1) => {
    const newRequirement: Requirement = {
      id: Date.now(),
      level,
      content: '',
      children: [],
      style: defaultStyles[level - 1] || 'numeric', // 使用默认样式
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

  const updateRequirementStyle = (id: number, style: string) => {
    setRequirements((prevRequirements) =>
      updateNestedRequirements(prevRequirements, id, (req) => ({
        ...req,
        style,
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
          defaultStyles={defaultStyles}
          onUpdateRequirement={updateRequirement}
          onRemoveRequirement={removeRequirement}
          onAddRequirement={addRequirement}
          renderRequirement={renderRequirement}
        />
      )
    },
    [defaultStyles, updateRequirement, updateRequirementStyle, removeRequirement, addRequirement]
  )

  const handleDefaultStyleChange = (level: number, newStyle: string) => {
    setDefaultStyles((prevStyles) => {
      const newStyles = [...prevStyles]
      newStyles[level - 1] = newStyle
      return newStyles
    })
  }

  const loadPresetRules = () => {
    // 确保 PRESET_RULES 包含 style 信息
    setRequirements(
      PRESET_RULES.map((rule) => ({
        ...rule,
        style: rule.style || defaultStyles[rule.level - 1] || 'numeric',
      }))
    )
  }

  const onDragEnd = (result: DropResult) => {
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

      return updateChildren(prevRequirements)
    })
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="mx-auto max-w-3xl p-6">
        <h2 className="mb-6 text-2xl font-bold">Admission Requirements</h2>
        <ControlPanel
          defaultStyles={defaultStyles}
          onDefaultStyleChange={handleDefaultStyleChange}
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
