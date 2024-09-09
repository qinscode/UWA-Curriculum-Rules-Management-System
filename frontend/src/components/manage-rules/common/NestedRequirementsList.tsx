import React, { useState, useEffect, useCallback } from 'react'
import { NestedRequirementsListProps, Requirement } from '@/types'
import SortedTree from '@/components/manage-rules/common/SortedTree'

const NestedRequirementsList: React.FC<NestedRequirementsListProps> = ({
  initialRequirements = [],
  presetRules = [],
  onUpdate,
  showControls = true,
  showHelpPanel = true,
}) => {
  const [requirements, setRequirements] = useState<Requirement[]>(initialRequirements)

  useEffect(() => {
    console.log('NestedRequirementsList: initialRequirements changed:', initialRequirements)
    console.log('NestedRequirementsList: Current requirements:', requirements)
    if (JSON.stringify(initialRequirements) !== JSON.stringify(requirements)) {
      console.log('NestedRequirementsList: Updating requirements with initialRequirements')
      setRequirements(initialRequirements)
    }
  }, [initialRequirements, requirements])

  const handleUpdateRequirement = useCallback((
    newRequirementsOrUpdater: ((prevState: Requirement[]) => Requirement[]) | Requirement[]
  ) => {
    setRequirements((prevRequirements) => {
      const newRequirements =
        typeof newRequirementsOrUpdater === 'function'
          ? newRequirementsOrUpdater(prevRequirements)
          : newRequirementsOrUpdater

      console.log('NestedRequirementsList: Updating requirements:', newRequirements)

      if (onUpdate) {
        onUpdate(newRequirements)
      }

      return newRequirements
    })
  }, [onUpdate])

  console.log('NestedRequirementsList: Rendering with requirements:', requirements)

  return (
    <div className="space-y-4">
      <SortedTree
        initialData={requirements}
        onUpdateRequirement={handleUpdateRequirement}
        onAddChildNode={(parentId: number) => {
          console.log('NestedRequirementsList - Adding child node to parent ID:', parentId)
        }}
        presetRequirements={presetRules}
        showControls={showControls}
        showHelpPanel={showHelpPanel}
      />
    </div>
  )
}

export default React.memo(NestedRequirementsList)
