import React, { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { AdmissionSelectionProps } from '@/types'

const AdmissionSelection: React.FC<AdmissionSelectionProps> = ({ data, updateData }) => {
  const [showRankingRequirements, setShowRankingRequirements] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-1 block text-lg font-medium">
          English language eligibility requirements
        </Label>
        <NestedRequirementsList
          initialRequirements={data.englishRequirements}
          onChange={(requirements) => updateData({ englishRequirements: requirements })}
          defaultStyles={['numeric', 'alphabetic', 'roman']}
          showControls={true}
          showHelpPanel={true}
        />
      </div>

      <div>
        <Label className="mb-1 block text-lg font-medium">Admissions</Label>
        <NestedRequirementsList
          presetRules={data.admissionRequirements}
          onChange={(requirements) => updateData({ admissionRequirements: requirements })}
          defaultStyles={['numeric', 'alphabetic', 'roman']}
          showControls={true}
          showHelpPanel={true}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="showRankingRequirements"
          checked={showRankingRequirements}
          onCheckedChange={setShowRankingRequirements}
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
            initialRequirements={data.rankingSelection}
            onChange={(requirements) => updateData({ rankingSelection: requirements })}
            defaultStyles={['numeric', 'alphabetic', 'roman']}
            showControls={true}
            showHelpPanel={true}
          />
        </div>
      )}
    </div>
  )
}

export default AdmissionSelection
