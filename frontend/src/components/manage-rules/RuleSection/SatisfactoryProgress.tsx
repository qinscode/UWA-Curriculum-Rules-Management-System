import React, { useState, useEffect, useCallback } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle, Requirement } from '@/types'

interface SatisfactoryProgressProps {
  data: {
    satisfactoryProgress: Requirement[]
  }
  updateData: (data: Partial<GeneralProps['data']>) => void
  initialPresetRules: any[]
}

const SatisfactoryProgress: React.FC<SatisfactoryProgressProps> = React.memo(
  ({ data, updateData, initialPresetRules }) => {
    const [showSatisfactoryProgress, setShowSatisfactoryProgress] = useState(false)

    useEffect(() => {
      setShowSatisfactoryProgress(data.satisfactoryProgress.length > 0)
    }, [data.satisfactoryProgress])

    const handleSatisfactoryProgressChange = useCallback(
      (
        requirementsOrUpdater: Requirement[] | ((prevRequirements: Requirement[]) => Requirement[])
      ) => {
        if (typeof requirementsOrUpdater === 'function') {
          updateData({
            satisfactoryProgress: requirementsOrUpdater(data.satisfactoryProgress),
          })
        } else {
          updateData({ satisfactoryProgress: requirementsOrUpdater })
        }
      },
      [updateData, data.satisfactoryProgress]
    )

    const handleToggleSwitch = (checked: boolean) => {
      setShowSatisfactoryProgress(checked)
      if (!checked) {
        updateData({ satisfactoryProgress: [] })
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="showSatisfactoryProgress"
            checked={showSatisfactoryProgress}
            onCheckedChange={handleToggleSwitch}
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
              onUpdate={handleSatisfactoryProgressChange}
              defaultStyles={[
                NumberingStyle.Numeric,
                NumberingStyle.Alphabetic,
                NumberingStyle.Roman,
              ]}
              showControls={true}
              showHelpPanel={true}
              presetRules={
                initialPresetRules?.length
                  ? (initialPresetRules[3].Requirements as Requirement[])
                  : undefined
              }
            />
          </div>
        )}
      </div>
    )
  }
)

SatisfactoryProgress.displayName = 'SatisfactoryProgress'

export default SatisfactoryProgress
