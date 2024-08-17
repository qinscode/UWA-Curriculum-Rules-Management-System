import React, { useState } from 'react'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import CheckboxWithLabel from '@/components/manage-rules/common/CheckboxWithLabel'
import { AdmissionSelectionProps } from '@/types'

const AdmissionSelection: React.FC<AdmissionSelectionProps> = ({ data, updateData }) => {
  const [showRankingRequirements, setShowRankingRequirements] = useState(false)

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          <div>
            <label className="mb-1 block text-lg font-medium text-gray-900">
              English language eligibility requirements
            </label>
            <NestedRequirementsList
              initialRequirements={data.englishRequirements}
              onChange={(requirements) => updateData({ englishRequirements: requirements })}
              defaultStyles={['numeric', 'alphabetic', 'roman']}
              showControls={true}
              showHelpPanel={true}
            />
          </div>

          <div>
            <label className="mb-1 block text-lg font-medium text-gray-900">Admissions</label>
            <NestedRequirementsList
              presetRules={data.admissionRequirements}
              onChange={(requirements) => updateData({ admissionRequirements: requirements })}
              defaultStyles={['numeric', 'alphabetic', 'roman']}
              showControls={true}
              showHelpPanel={true}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Ranking and selection for admission
            </label>
            <CheckboxWithLabel
              id="showRankingRequirements"
              description="There are specific ranking and selection tools or requirements for this course."
              checked={showRankingRequirements}
              onChange={setShowRankingRequirements}
            />
          </div>

          {showRankingRequirements && (
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

export default AdmissionSelection
