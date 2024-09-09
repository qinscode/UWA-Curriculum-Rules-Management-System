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
}

const SatisfactoryProgress: React.FC<SatisfactoryProgressProps> = React.memo(
  ({ data, updateData }) => {
    const [showSatisfactoryProgress, setShowSatisfactoryProgress] = useState(false)

    useEffect(() => {
      console.log('SatisfactoryProgress: Data changed', data.satisfactoryProgress)
      setShowSatisfactoryProgress(data.satisfactoryProgress.length > 0)
    }, [data.satisfactoryProgress])

    const handleSatisfactoryProgressChange = useCallback(
      (requirements: Requirement[]) => {
        console.log('SatisfactoryProgress: Updating requirements', requirements)
        updateData({ satisfactoryProgress: requirements })
      },
      [updateData]
    )

    const handleToggleSwitch = (checked: boolean) => {
      console.log('SatisfactoryProgress: Toggle switch', checked)
      setShowSatisfactoryProgress(checked)
      if (!checked) {
        updateData({ satisfactoryProgress: [] })
      }
    }

    console.log('SatisfactoryProgress: Rendering', { showSatisfactoryProgress, data })

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
            />
          </div>
        )}
      </div>
    )
  }
)

SatisfactoryProgress.displayName = 'SatisfactoryProgress'

export default SatisfactoryProgress
