import React, { useEffect, useState } from 'react'
import { NestedRequirementsListProps } from '@/types'

import SortedTree from '@/components/manage-rules/common/SortedTree'

const NestedRequirementsList: React.FC<NestedRequirementsListProps> = ({
  initialRequirements = [],
  presetRules = [],
  onChange,
}) => {
  const [requirements, setRequirements] = useState(initialRequirements)

  useEffect(() => {
    // 打印初始数据
    console.log('Initial Requirements:', JSON.stringify(initialRequirements, null, 2))
  }, [])

  const handleUpdateRequirement = (newRequirements) => {
    setRequirements(newRequirements)

    // 调用父组件的 onChange 函数
    if (onChange) {
      onChange(newRequirements)
    }
  }
  const handleAddChildNodeInParent = (parentId: number) => {
    console.log('Adding child node to parent ID:', parentId)
  }

  return (
    <div className="space-y-4">
      <SortedTree
        initialData={requirements}
        onUpdateRequirement={handleUpdateRequirement}
        onAddChildNode={handleAddChildNodeInParent}
        presetRequirements={presetRules}
      />
      <button onClick={() => console.log('Current Requirements:', requirements)}>
        Print Current Requirements
      </button>
    </div>
  )
}

export default NestedRequirementsList
