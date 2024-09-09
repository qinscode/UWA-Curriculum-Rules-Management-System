import React from 'react'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { ManageR, NumberingStyle } from '@/types'

const ProgressStatus: React.FC<ManageR> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-1 block text-lg font-medium">Progress status rule</Label>
        <NestedRequirementsList
          initialRequirements={data.progressStatus}
          onChange={(requirements) => updateData({ progressStatus: requirements })}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
        />
      </div>
    </div>
  )
}

export default ProgressStatus
