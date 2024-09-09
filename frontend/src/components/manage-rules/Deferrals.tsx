import React, { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle } from '@/types'

const Deferrals: React.FC<GeneralProps> = ({ data, updateData }) => {
  const [showDeferralRules, setShowDeferralRules] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Switch
          id="deferralAllowed"
          checked={data.deferralAllowed}
          onCheckedChange={(checked) => updateData({ deferralAllowed: checked })}
        />
        <Label htmlFor="deferralAllowed" className="text-sm">
          Deferral is allowed for this course
        </Label>
      </div>

      {data.deferralAllowed && (
        <div className="flex items-center space-x-2">
          <Switch
            id="showDeferralRules"
            checked={showDeferralRules}
            onCheckedChange={setShowDeferralRules}
          />
          <Label htmlFor="showDeferralRules" className="text-sm">
            Specify custom deferral rules
          </Label>
        </div>
      )}

      {data.deferralAllowed && showDeferralRules && (
        <div>
          <Label className="mb-1 block text-lg font-medium">Custom deferral rules</Label>
          <NestedRequirementsList
            initialRequirements={data.deferralRules}
            onUpdate={(requirements) => updateData({ deferralRules: requirements })}
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

export default Deferrals
