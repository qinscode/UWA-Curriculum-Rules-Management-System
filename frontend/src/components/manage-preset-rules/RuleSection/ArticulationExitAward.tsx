import React, { useCallback } from 'react'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle, Requirement } from '@/types'

const ArticulationExitAward: React.FC<GeneralProps> = ({
  data,
  updateData,
  initialPresetRules,
}) => {
  const handleUpdateArticulationExitAward = useCallback(
    (
      requirementsOrUpdater: Requirement[] | ((prevRequirements: Requirement[]) => Requirement[])
    ) => {
      if (typeof requirementsOrUpdater === 'function') {
        const updatedRequirements = requirementsOrUpdater(data.articulationExitAward || [])
        updateData({ articulationExitAward: updatedRequirements })
      } else {
        updateData({ articulationExitAward: requirementsOrUpdater })
      }
    },
    [updateData, data.articulationExitAward]
  )

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-1 block text-lg font-medium">Articulation and Exit Award</Label>
        <NestedRequirementsList
          initialRequirements={data.articulationExitAward || []}
          onUpdate={handleUpdateArticulationExitAward}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
          presetRules={
            initialPresetRules?.length
              ? (initialPresetRules[2].Requirements as Requirement[])
              : undefined
          }
        />
      </div>
    </div>
  )
}

export default ArticulationExitAward
