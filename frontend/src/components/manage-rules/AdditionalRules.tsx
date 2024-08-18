import React from 'react'
import { Label } from '@/components/ui/label'
import { AdmissionSelectionProps } from '@/types'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'

const AdditionalRules: React.FC<AdmissionSelectionProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
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
    </div>
  )
}

export default AdditionalRules
