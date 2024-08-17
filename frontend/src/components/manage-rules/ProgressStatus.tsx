import React, { useState } from 'react'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import CheckboxWithLabel from '@/components/manage-rules/common/CheckboxWithLabel'
import { AdmissionSelectionProps } from '@/types'

const ProgressStatus: React.FC<AdmissionSelectionProps> = ({ data, updateData }) => {
  const [showRankingRequirements, setShowRankingRequirements] = useState(false)

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-lg font-medium text-gray-900">
              Progress status rule
            </label>
            <NestedRequirementsList
              initialRequirements={data.englishRequirements}
              onChange={(requirements) => updateData({ englishRequirements: requirements })}
              defaultStyles={['numeric', 'alphabetic', 'roman']}
              showControls={true}
              showHelpPanel={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressStatus
