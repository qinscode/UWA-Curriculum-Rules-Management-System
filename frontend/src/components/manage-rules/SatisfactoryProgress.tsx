import React, { useState } from 'react'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import CheckboxWithLabel from '@/components/manage-rules/common/CheckboxWithLabel'
import { AdmissionSelectionProps } from '@/types'

const SatisfactoryProgress: React.FC<AdmissionSelectionProps> = ({ data, updateData }) => {
  const [showSatisfactoryProgress, setShowSatisfactoryProgress] = useState(false)

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-lg font-medium text-gray-900">
              Does satisfactory progress in this course differ from University Policy?
            </label>
            <CheckboxWithLabel
              id="showSatisfactoryProgress"
              description="Yes, satisfactory progress differs from University Policy"
              checked={showSatisfactoryProgress}
              onChange={setShowSatisfactoryProgress}
            />
          </div>

          {showSatisfactoryProgress && (
            <div>
              <NestedRequirementsList
                initialRequirements={data.rankingSelection}
                onChange={(requirements) => updateData({ rankingSelection: requirements })}
                defaultStyles={['numeric', 'alphabetic', 'roman']}
                showControls={true}
                showHelpPanel={true}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SatisfactoryProgress
