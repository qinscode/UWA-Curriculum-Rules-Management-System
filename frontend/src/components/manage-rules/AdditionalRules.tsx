import React from 'react'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle, Requirement } from '@/types'

const AdditionalRules: React.FC<GeneralProps> = ({ data, updateData }) => {
  const handleUpdate = (requirements: Requirement[]) => {
    console.log('AdditionalRules: Updating requirements', requirements)
    updateData({ additionalRules: requirements })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-1 block text-lg font-medium">Admissions</Label>
        <NestedRequirementsList
          presetRules={data.additionalRules}
          onUpdate={handleUpdate}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
        />
      </div>
    </div>
  )
}

export default AdditionalRules
