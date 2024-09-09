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

  const handleUpdateRequirement = (
    newRequirementsOrUpdater: ((prevState: Requirement[]) => Requirement[]) | Requirement[]
  ) => {
    setRequirements((prevRequirements) => {
      const newRequirements =
        typeof newRequirementsOrUpdater === 'function'
          ? newRequirementsOrUpdater(prevRequirements)
          : newRequirementsOrUpdater

      console.log(
        'NestedRequirementsList - Updating requirements:',
        JSON.stringify(newRequirements, null, 2)
      )

      if (onUpdate) {
        onUpdate(newRequirements)
      }

      return newRequirements
    })
  }

  const handleAddChildNodeInParent = (parentId: number) => {
    console.log('NestedRequirementsList - Adding child node to parent ID:', parentId)
  }

  return (
    <div className="space-y-4">
      <SortedTree
        initialData={requirements}
        onUpdateRequirement={(newReqsOrUpdater) => {
          const newReqs =
            typeof newReqsOrUpdater === 'function'
              ? newReqsOrUpdater(requirements)
              : newReqsOrUpdater
          handleUpdateRequirement(newReqs)
        }}
        onAddChildNode={handleAddChildNodeInParent}
        presetRequirements={presetRules}
        showControls={showControls}
        showHelpPanel={showHelpPanel}
      />
    </div>
  )
}

export default NestedRequirementsList
