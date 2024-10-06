import React, { useCallback } from 'react'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle, Requirement } from '@/types'

const CourseStructure: React.FC<GeneralProps> = ({ data, updateData, initialPresetRules }) => {
  const handleUpdateCourseStructure = useCallback(
    (
      requirementsOrUpdater: Requirement[] | ((prevRequirements: Requirement[]) => Requirement[])
    ) => {
      if (typeof requirementsOrUpdater === 'function') {
        const updatedRequirements = requirementsOrUpdater(data.courseStructure || [])
        updateData({ courseStructure: updatedRequirements })
      } else {
        updateData({ courseStructure: requirementsOrUpdater })
      }
    },
    [updateData, data.courseStructure]
  )

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-1 block text-lg font-medium">Course Structure</Label>
        <NestedRequirementsList
          initialRequirements={data.courseStructure || []}
          onUpdate={handleUpdateCourseStructure}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
          presetRules={
            initialPresetRules?.length
              ? (initialPresetRules[13].Requirements as Requirement[])
              : undefined
          }
        />
      </div>
    </div>
  )
}

export default CourseStructure
