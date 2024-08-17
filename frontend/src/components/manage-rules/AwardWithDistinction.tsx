import React, { useState } from 'react'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import CheckboxWithLabel from '@/components/manage-rules/common/CheckboxWithLabel'
import { AdmissionSelectionProps } from '@/types'

const AwardWithDistinction: React.FC<AdmissionSelectionProps> = ({ data, updateData }) => {
  const [showAwardWithDistinction, setShowAwardWithDistinction] = useState(false)

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-lg font-medium text-gray-900">
              Is this course proposed to be exempt from the standard rule for award with
              distinction?
            </label>
            <CheckboxWithLabel
              id="showAwardWithDistinction"
              description="Exemption sought"
              checked={showAwardWithDistinction}
              onChange={setShowAwardWithDistinction}
            />
          </div>

          {showAwardWithDistinction && (
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

export default AwardWithDistinction
