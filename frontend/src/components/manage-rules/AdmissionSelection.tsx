import React, { useState, useEffect, useCallback } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle, Requirement } from '@/types'

interface AdmissionSelectionProps {
  data: {
    englishRequirements: Requirement[]
    admissionRequirements: Requirement[]
    rankingSelection: Requirement[]
  }
  updateData: (data: Partial<GeneralProps['data']>) => void
}

const AdmissionSelection: React.FC<AdmissionSelectionProps> = React.memo(({ data, updateData }) => {
  const [showRankingRequirements, setShowRankingRequirements] = useState(false)

  useEffect(() => {
    console.log('AdmissionSelection: Ranking data changed', data.rankingSelection)
    setShowRankingRequirements(data.rankingSelection.length > 0)
  }, [data.rankingSelection])

  const handleEnglishRequirementsChange = useCallback((requirements: Requirement[]) => {
    console.log('AdmissionSelection: Updating English requirements', requirements)
    updateData({ englishRequirements: requirements })
  }, [updateData])

  const handleAdmissionRequirementsChange = useCallback((requirements: Requirement[]) => {
    console.log('AdmissionSelection: Updating Admission requirements', requirements)
    updateData({ admissionRequirements: requirements })
  }, [updateData])

  const handleRankingSelectionChange = useCallback((requirements: Requirement[]) => {
    console.log('AdmissionSelection: Updating ranking requirements', requirements)
    updateData({ rankingSelection: requirements })
  }, [updateData])

  const handleToggleRankingRequirements = useCallback((checked: boolean) => {
    console.log('AdmissionSelection: Toggle ranking requirements', checked)
    setShowRankingRequirements(checked)
    if (!checked) {
      updateData({ rankingSelection: [] })
    }
  }, [updateData])

  console.log('AdmissionSelection: Rendering', {
    showRankingRequirements,
    rankingSelectionLength: data.rankingSelection.length,
    rankingSelectionData: data.rankingSelection
  })

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
          onCheckedChange={handleToggleRankingRequirements}
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
            onUpdate={handleRankingSelectionChange}
            defaultStyles={[
              NumberingStyle.Numeric,
              NumberingStyle.Alphabetic,
              NumberingStyle.Roman,
            ]}
            showControls={true}
            showHelpPanel={true}
          />
          {console.log('AdmissionSelection: Passing ranking data to NestedRequirementsList', data.rankingSelection)}
        </div>
      )}
    </div>
  )
})

AdmissionSelection.displayName = 'AdmissionSelection'

export default AdmissionSelection
