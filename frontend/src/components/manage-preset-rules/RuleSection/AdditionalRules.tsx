import React from 'react'
import { Label } from '@/components/ui/label'
import { GeneralProps, NumberingStyle, Requirement } from '@/types'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'

const AdditionalRules: React.FC<GeneralProps> = ({ data, updateData, initialPresetRules }) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-1 block text-lg font-medium">Admissions</Label>
        <NestedRequirementsList
          initialRequirements={data.additionalRules}
          onUpdate={(requirements) =>
            updateData({ additionalRules: requirements as Requirement[] })
          }
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
    </div>
  )
}

export default AdditionalRules
