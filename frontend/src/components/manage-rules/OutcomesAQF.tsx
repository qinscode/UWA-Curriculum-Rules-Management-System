import React from 'react'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { ManageR, NumberingStyle } from '@/types'

const OutcomesAQF: React.FC<ManageR> = ({ data, updateData }) => {
  return (
    <div className="space-y-8">
      <div>
        <Label className="mb-1 block text-lg font-medium">Knowledge</Label>
        <NestedRequirementsList
          initialRequirements={data.knowledge || []}
          onChange={(requirements) => updateData({ knowledge: requirements })}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
        />
      </div>

      <div>
        <Label className="mb-1 block text-lg font-medium">Skills</Label>
        <NestedRequirementsList
          initialRequirements={data.skills || []}
          onChange={(requirements) => updateData({ skills: requirements })}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
        />
      </div>

      <div>
        <Label className="mb-1 block text-lg font-medium">Application of knowledge to skills</Label>
        <NestedRequirementsList
          initialRequirements={data.applicationOfKnowledge || []}
          onChange={(requirements) => updateData({ applicationOfKnowledge: requirements })}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
        />
      </div>
    </div>
  )
}

export default OutcomesAQF
