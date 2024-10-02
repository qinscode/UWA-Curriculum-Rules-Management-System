import React, { useCallback } from 'react'
import { Label } from '@/components/ui/label'
import NestedRequirementsList from '@/components/manage-rules/common/NestedRequirementsList'
import { GeneralProps, NumberingStyle, Requirement } from '@/types'

interface OutcomesAQFProps {
  data: {
    knowledge: Requirement[]
    skills: Requirement[]
    knowledgeApplication: Requirement[]
  }
  updateData: (data: Partial<GeneralProps['data']>) => void
  initialPresetRules: any[]
}

const OutcomesAQF: React.FC<OutcomesAQFProps> = React.memo(
  ({ data, updateData, initialPresetRules }) => {
    const handleRequirementsChange = useCallback(
      (key: 'knowledge' | 'skills' | 'knowledgeApplication') =>
        (
          requirementsOrUpdater:
            | Requirement[]
            | ((prevRequirements: Requirement[]) => Requirement[])
        ) => {
          if (typeof requirementsOrUpdater === 'function') {
            const updatedRequirements = requirementsOrUpdater(data[key])
            updateData({ [key]: updatedRequirements })
          } else {
            updateData({ [key]: requirementsOrUpdater })
          }
        },
      [data, updateData]
    )

    return (
      <div className="space-y-6">
        <div>
          <Label className="mb-1 block text-lg font-medium">Knowledge</Label>
          <NestedRequirementsList
            initialRequirements={data.knowledge}
            onUpdate={handleRequirementsChange('knowledge')}
            defaultStyles={[
              NumberingStyle.Numeric,
              NumberingStyle.Alphabetic,
              NumberingStyle.Roman,
            ]}
            showControls={true}
            showHelpPanel={true}
            presetRules={
              initialPresetRules?.length
                ? (initialPresetRules[10].requirements as Requirement[])
                : undefined
            }
          />
        </div>

        <div>
          <Label className="mb-1 block text-lg font-medium">Skills</Label>
          <NestedRequirementsList
            initialRequirements={data.skills}
            onUpdate={handleRequirementsChange('skills')}
            defaultStyles={[
              NumberingStyle.Numeric,
              NumberingStyle.Alphabetic,
              NumberingStyle.Roman,
            ]}
            showControls={true}
            showHelpPanel={true}
            presetRules={
              initialPresetRules?.length
                ? (initialPresetRules[6].requirements as Requirement[])
                : undefined
            }
          />
        </div>

        <div>
          <Label className="mb-1 block text-lg font-medium">
            Application of Knowledge and Skills
          </Label>
          <NestedRequirementsList
            initialRequirements={data.knowledgeApplication}
            onUpdate={handleRequirementsChange('knowledgeApplication')}
            defaultStyles={[
              NumberingStyle.Numeric,
              NumberingStyle.Alphabetic,
              NumberingStyle.Roman,
            ]}
            showControls={true}
            showHelpPanel={true}
            presetRules={
              initialPresetRules?.length
                ? (initialPresetRules[7].requirements as Requirement[])
                : undefined
            }
          />
        </div>
      </div>
    )
  }
)

OutcomesAQF.displayName = 'OutcomesAQF'

export default OutcomesAQF
