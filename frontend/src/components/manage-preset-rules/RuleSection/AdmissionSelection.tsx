import React, { useCallback } from 'react'
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
  showRankingRequirements: boolean
  setShowRankingRequirements: React.Dispatch<React.SetStateAction<boolean>>
  initialPresetRules: any[]
}

const AdmissionSelection: React.FC<AdmissionSelectionProps> = ({
  data,
  updateData,
  showRankingRequirements,
  setShowRankingRequirements,
  initialPresetRules,
}) => {
  const handleEnglishRequirementsChange = useCallback(
    (requirements: Requirement[] | ((prevRequirements: Requirement[]) => Requirement[])) => {
      updateData({ englishRequirements: requirements as Requirement[] })
    },
    [updateData]
  )

  const handleAdmissionRequirementsChange = useCallback(
    (requirements: Requirement[] | ((prevRequirements: Requirement[]) => Requirement[])) => {
      updateData({ admissionRequirements: requirements as Requirement[] })
    },
    [updateData]
  )

  const handleRankingSelectionChange = useCallback(
    (requirements: Requirement[] | ((prevRequirements: Requirement[]) => Requirement[])) => {
      updateData({ rankingSelection: requirements as Requirement[] })
    },
    [updateData]
  )

  const handleToggleRankingRequirements = useCallback(
    (checked: boolean) => {
      setShowRankingRequirements(checked)
      if (!checked) {
        updateData({ rankingSelection: [] })
      }
    },
    [updateData]
  )

  const handleAddRequirement = (
    type: 'englishRequirements' | 'admissionRequirements' | 'rankingSelection'
  ) => {
    const newRequirement = {
      id: Date.now(),
      content: 'New Requirement',
      style: NumberingStyle.Numeric,
      children: [],
    }
    updateData({
      [type]: [...data[type], newRequirement],
    })
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
          presetRules={
            initialPresetRules?.length
              ? (initialPresetRules[0].Requirements as Requirement[])
              : undefined
          }
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
          presetRules={
            initialPresetRules?.length
              ? (initialPresetRules[8].Requirements as Requirement[])
              : undefined
          }
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
            presetRules={
              initialPresetRules?.length
                ? (initialPresetRules[9].Requirements as Requirement[])
                : undefined
            }
          />
        </div>
      )}
    </div>
  )
}

AdmissionSelection.displayName = 'AdmissionSelection'

export default AdmissionSelection
