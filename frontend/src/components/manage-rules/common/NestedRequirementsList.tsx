import React, { useCallback } from 'react'
import { NestedRequirementsListProps, Requirement } from '@/types'
import SortedTree from '@/components/manage-rules/common/SortedTree'

const NestedRequirementsList: React.FC<NestedRequirementsListProps> = ({
  initialRequirements = [],
  presetRules = [],
  onUpdate,
  showControls = true,
  showHelpPanel = true,
}) => {
  const handleUpdateRequirement = useCallback((
    newRequirementsOrUpdater: Requirement[] | ((prevState: Requirement[]) => Requirement[])
  ) => {
    console.log('NestedRequirementsList: Updating requirements:', newRequirementsOrUpdater)
    if (onUpdate) {
      if (typeof newRequirementsOrUpdater === 'function') {
        onUpdate((prevRequirements) => {
          const updatedRequirements = newRequirementsOrUpdater(prevRequirements);
          return updatedRequirements;
        })
      } else {
        onUpdate(newRequirementsOrUpdater)
      }
    }
  }, [onUpdate])

  return (
    <div className="space-y-4">
      <SortedTree
        initialData={initialRequirements}
        onUpdateRequirement={handleUpdateRequirement}
        presetRequirements={presetRules}
        showControls={showControls}
        showHelpPanel={showHelpPanel}
      />
    </div>
  )
}

export default React.memo(NestedRequirementsList)
