import React, { useCallback, useEffect } from 'react'
import { NestedRequirementsListProps, Requirement } from '@/types'
import SortedTree from '@/components/manage-rules/common/SortedTree'

const NestedRequirementsList: React.FC<NestedRequirementsListProps> = ({
  initialRequirements = [],
  presetRules = [],
  onUpdate,
  showControls = true,
  showHelpPanel = true,
}) => {
  const handleUpdateRequirement = useCallback(
    (newRequirementsOrUpdater: Requirement[] | ((prevState: Requirement[]) => Requirement[])) => {
      console.log('NestedRequirementsList: handleUpdateRequirement called')
      if (onUpdate) {
        onUpdate(newRequirementsOrUpdater)
      }
    },
    [onUpdate]
  )

  useEffect(() => {
    console.log('FFFFFFF', presetRules)
  }, [presetRules])

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
