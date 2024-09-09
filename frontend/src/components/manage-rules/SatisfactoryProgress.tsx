import React, { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle } from '@/types'

const SatisfactoryProgress: React.FC<GeneralProps> = ({ data, updateData }) => {
  const [showSatisfactoryProgress, setShowSatisfactoryProgress] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="showSatisfactoryProgress"
          checked={showSatisfactoryProgress}
          onCheckedChange={setShowSatisfactoryProgress}
        />
        <Label htmlFor="showSatisfactoryProgress" className="text-sm">
          Satisfactory progress in this course differs from University Policy
        </Label>
      </div>

      {showSatisfactoryProgress && (
        <div>
          <Label className="mb-1 block text-lg font-medium">
            Specify custom satisfactory progress rules
          </Label>
          <NestedRequirementsList
            initialRequirements={data.satisfactoryProgress}
            onUpdate={(requirements) => updateData({ satisfactoryProgress: requirements })}
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

export default SatisfactoryProgress
