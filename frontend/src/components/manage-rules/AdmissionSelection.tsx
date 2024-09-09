import React, { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle, Requirement } from '@/types'

const AdmissionSelection: React.FC<GeneralProps> = ({ data, updateData }) => {
  const [showRankingRequirements, setShowRankingRequirements] = useState(
    !!data.rankingSelection && data.rankingSelection.length > 0
  )

  const handleEnglishRequirementsChange = (requirements: Requirement[]) => {
    updateData({ englishRequirements: requirements })
  }

  const handleAdmissionRequirementsChange = (requirements: Requirement[]) => {
    updateData({ admissionRequirements: requirements })
  }

  const handleRankingSelectionChange = (requirements: Requirement[]) => {
    updateData({ rankingSelection: requirements })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-1 block text-lg font-medium">
          English language eligibility requirements
        </Label>
        <NestedRequirementsList
          initialRequirements={data.englishRequirements}
          onUpdate={handleEnglishRequirementsChange}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
        />
      </div>

      <div>
        <Label className="mb-1 block text-lg font-medium">Admission requirements</Label>
        <NestedRequirementsList
          initialRequirements={data.admissionRequirements}
          onUpdate={handleAdmissionRequirementsChange}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="showRankingRequirements"
          checked={showRankingRequirements}
          onCheckedChange={(checked) => {
            setShowRankingRequirements(checked)
            if (!checked) {
              updateData({ rankingSelection: [] })
            }
          }}
        />
        <Label htmlFor="showRankingRequirements">
          There are specific ranking and selection tools or requirements for this course.
        </Label>
      </div>

      {showRankingRequirements && (
        <div>
          <Label className="mb-1 block text-lg font-medium">
            Ranking and selection for admission
          </Label>
          <NestedRequirementsList
            initialRequirements={data.rankingSelection || []}
            onUpdate={handleRankingSelectionChange}
            defaultStyles={[
              NumberingStyle.Numeric,
              NumberingStyle.Alphabetic,
              NumberingStyle.Roman,
            ]}
            showControls={true}
            showHelpPanel={true}
          />
        </div>
      )}
    </div>
  )
}

export default AdmissionSelection
