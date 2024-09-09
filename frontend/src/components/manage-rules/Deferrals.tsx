import React, { useState, useEffect, useCallback } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle, Requirement } from '@/types'

interface DeferralsProps {
  data: {
    deferrals: Requirement[]
    deferralAllowed: boolean
  }
  updateData: (data: Partial<GeneralProps['data']>) => void
}

const Deferrals: React.FC<DeferralsProps> = React.memo(
  ({ data, updateData }) => {
    const [showDeferralRules, setShowDeferralRules] = useState(false)

    useEffect(() => {
      console.log('Deferrals: Data changed', data.deferrals)
      setShowDeferralRules(data.deferrals.length > 0)
    }, [data.deferrals])

    const handleDeferralsChange = useCallback(
      (requirements: Requirement[]) => {
        console.log('Deferrals: Updating requirements', requirements)
        updateData({ deferrals: requirements })
      },
      [updateData]
    )

    const handleToggleDeferralAllowed = (checked: boolean) => {
      console.log('Deferrals: Toggle deferral allowed', checked)
      updateData({ deferralAllowed: checked })
      if (!checked) {
        updateData({ deferrals: [] })
        setShowDeferralRules(false)
      }
    }

    const handleToggleCustomRules = (checked: boolean) => {
      console.log('Deferrals: Toggle custom rules', checked)
      setShowDeferralRules(checked)
      if (!checked) {
        updateData({ deferrals: [] })
      }
    }

    console.log('Deferrals: Rendering', { showDeferralRules, data })

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="deferralAllowed"
            checked={data.deferralAllowed}
            onCheckedChange={handleToggleDeferralAllowed}
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
              onCheckedChange={handleToggleCustomRules}
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
              initialRequirements={data.deferrals}
              onUpdate={handleDeferralsChange}
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
)

Deferrals.displayName = 'Deferrals'

export default Deferrals
