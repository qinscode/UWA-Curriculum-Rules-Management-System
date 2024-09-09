import React, { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle } from '@/types'

const AwardWithDistinction: React.FC<GeneralProps> = ({ data, updateData }) => {
  const [showAwardWithDistinction, setShowAwardWithDistinction] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="showAwardWithDistinction"
          checked={showAwardWithDistinction}
          onCheckedChange={setShowAwardWithDistinction}
        />
        <Label htmlFor="showAwardWithDistinction" className="text-sm">
          This course is proposed to be exempt from the standard rule for award with distinction
        </Label>
      </div>

      {showAwardWithDistinction && (
        <div>
          <Label className="mb-1 block text-lg font-medium">
            Specify custom award with distinction rules
          </Label>
          <NestedRequirementsList
            initialRequirements={data.awardWithDistinction}
            onUpdate={(requirements) => updateData({ awardWithDistinction: requirements })}
            defaultStyles={[
              NumberingStyle.Numeric,
              NumberingStyle.Alphabetic,
              NumberingStyle.Roman,
            ]}
            showControls={true}
            showHelpPanel={true}
          />
        </div>
      )}
    </div>
  )
}

export default AwardWithDistinction
