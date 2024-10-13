import React, { useState, useEffect, useCallback } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle, Requirement } from '@/types'

interface AwardWithDistinctionProps {
  data: {
    awardWithDistinction: Requirement[]
  }
  updateData: (data: Partial<GeneralProps['data']>) => void
  initialPresetRules: any[]
}

const AwardWithDistinction: React.FC<AwardWithDistinctionProps> = React.memo(
  ({ data, updateData, initialPresetRules }) => {
    const [showAwardWithDistinction, setShowAwardWithDistinction] = useState(false)

    useEffect(() => {
      setShowAwardWithDistinction(data.awardWithDistinction.length > 0)
    }, [data.awardWithDistinction])

    const handleAwardWithDistinctionChange = useCallback(
      (
        requirementsOrUpdater: Requirement[] | ((prevRequirements: Requirement[]) => Requirement[])
      ) => {
        if (typeof requirementsOrUpdater === 'function') {
          const updatedRequirements = requirementsOrUpdater(data.awardWithDistinction)
          updateData({ awardWithDistinction: updatedRequirements })
        } else {
          updateData({ awardWithDistinction: requirementsOrUpdater })
        }
      },
      [updateData, data.awardWithDistinction]
    )

    const handleToggleSwitch = (checked: boolean) => {
      setShowAwardWithDistinction(checked)
      if (!checked) {
        updateData({ awardWithDistinction: [] })
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="showAwardWithDistinction"
            checked={showAwardWithDistinction}
            onCheckedChange={handleToggleSwitch}
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
              onUpdate={handleAwardWithDistinctionChange}
              defaultStyles={[
                NumberingStyle.Numeric,
                NumberingStyle.Alphabetic,
                NumberingStyle.Roman,
              ]}
              showControls={true}
              showHelpPanel={true}
              presetRules={
                initialPresetRules?.length
                  ? (initialPresetRules[6].Requirements as Requirement[])
                  : undefined
              }
            />
          </div>
        )}
      </div>
    )
  }
)

AwardWithDistinction.displayName = 'AwardWithDistinction'

export default AwardWithDistinction
