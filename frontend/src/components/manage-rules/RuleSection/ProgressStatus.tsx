import React, { useCallback } from 'react'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle, Requirement } from '@/types'

const ProgressStatus: React.FC<GeneralProps> = ({ data, updateData, initialPresetRules }) => {
  const handleUpdateProgressStatus = useCallback(
    (
      requirementsOrUpdater: Requirement[] | ((prevRequirements: Requirement[]) => Requirement[])
    ) => {
      if (typeof requirementsOrUpdater === 'function') {
        const updatedRequirements = requirementsOrUpdater(data.progressStatus || [])
        updateData({ progressStatus: updatedRequirements })
      } else {
        updateData({ progressStatus: requirementsOrUpdater })
      }
    },
    [updateData, data.progressStatus]
  )

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-1 block text-lg font-medium">Progress status rule</Label>
        <NestedRequirementsList
          initialRequirements={data.progressStatus || []}
          onUpdate={handleUpdateProgressStatus}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
          presetRules={
            initialPresetRules?.length
              ? (initialPresetRules[4].requirements as Requirement[])
              : undefined
          }
        />
      </div>
    </div>
  )
}

export default ProgressStatus
