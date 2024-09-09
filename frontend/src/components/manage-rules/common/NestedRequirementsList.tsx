import React, { useEffect, useState } from 'react'
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

  const handleUpdateRequirement = (newRequirements: Requirement[]) => {
    setRequirements(newRequirements)
    if (onUpdate) {
      onUpdate(newRequirements)
    }
  }

  const handleAddChildNodeInParent = (parentId: number) => {
    console.log('NestedRequirementsList - Adding child node to parent ID:', parentId)
    // Implement the logic to add a child node here
    // You might want to update the requirements state and call onChange
  }

  return (
    <div className="space-y-4">
      <SortedTree
        initialData={requirements}
        onUpdateRequirement={handleUpdateRequirement}
        onAddChildNode={handleAddChildNodeInParent}
        presetRequirements={presetRules}
        showControls={showControls}
        showHelpPanel={showHelpPanel}
      />
    </div>
  )
}

export default NestedRequirementsList
