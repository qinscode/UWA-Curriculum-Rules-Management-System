import React, { useEffect, useState } from 'react'
import { NestedRequirementsListProps, Requirement } from '@/types'
import SortedTree from '@/components/manage-rules/common/SortedTree'

const NestedRequirementsList: React.FC<NestedRequirementsListProps> = ({
  initialRequirements = [],
  presetRules = [],
  onChange,
  showControls = true,
  showHelpPanel = true,
}) => {
  const [requirements, setRequirements] = useState<Requirement[]>(initialRequirements)

  // useEffect(() => {
  //   console.log(
  //     'NestedRequirementsList - initialRequirements:',
  //     JSON.stringify(initialRequirements, null, 2)
  //   )
  //   console.log('NestedRequirementsList - presetRules:', JSON.stringify(presetRules, null, 2))
  //
  //   if (initialRequirements.length > 0) {
  //     console.log('Setting requirements from initialRequirements')
  //     setRequirements(initialRequirements)
  //   } else if (presetRules.length > 0) {
  //     console.log('Setting requirements from presetRules')
  //     setRequirements(presetRules)
  //   } else {
  //     console.log('No initial requirements or preset rules provided')
  //   }
  // }, [initialRequirements, presetRules])

  // useEffect(() => {
  //   console.log(
  //     'NestedRequirementsList - Current requirements:',
  //     JSON.stringify(requirements, null, 2)
  //   )
  // }, [requirements])

  const handleUpdateRequirement = (newRequirements: Requirement[]) => {
    console.log(
      'NestedRequirementsList - Updating requirements:',
      JSON.stringify(newRequirements, null, 2)
    )
    setRequirements(newRequirements)

    if (onChange) {
      onChange(newRequirements)
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
