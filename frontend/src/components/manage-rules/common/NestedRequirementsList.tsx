import React, { useState } from 'react'
import { NestedRequirementsListProps } from '@/types'

import BasePage from '@/components/manage-rules/common/SortedTree'

const NestedRequirementsList: React.FC<NestedRequirementsListProps> = ({
  initialRequirements = [],
  presetRules = [],
}) => {
  const [useRequirement, setUseRequirement] = useState(initialRequirements)

  const handleAddChildNodeInParent = (parentId: number) => {
    console.log('Adding child node to parent ID:', parentId)
  }

  return (
    <div className="space-y-4">
      <BasePage
        initialData={useRequirement}
        onUpdateRequirement={setUseRequirement}
        onAddChildNode={handleAddChildNodeInParent}
        presetRequirements={presetRules}
      />
    </div>
  )
}

export default NestedRequirementsList
