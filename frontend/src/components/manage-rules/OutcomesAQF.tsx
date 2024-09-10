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
}

const OutcomesAQF: React.FC<OutcomesAQFProps> = React.memo(({ data, updateData }) => {
  const handleKnowledgeChange = useCallback(
    (requirements: Requirement[]) => {
      updateData({ knowledge: requirements })
    },
    [updateData]
  )

  const handleSkillsChange = useCallback(
    (requirements: Requirement[]) => {
      updateData({ skills: requirements })
    },
    [updateData]
  )

  const handleKnowledgeApplicationChange = useCallback(
    (requirements: Requirement[]) => {
      updateData({ knowledgeApplication: requirements })
    },
    [updateData]
  )

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-1 block text-lg font-medium">Knowledge</Label>
        <NestedRequirementsList
          initialRequirements={data.knowledge}
          onUpdate={handleKnowledgeChange}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
        />
      </div>

      <div>
        <Label className="mb-1 block text-lg font-medium">Skills</Label>
        <NestedRequirementsList
          initialRequirements={data.skills}
          onUpdate={handleSkillsChange}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
        />
      </div>

      <div>
        <Label className="mb-1 block text-lg font-medium">
          Application of Knowledge and Skills
        </Label>
        <NestedRequirementsList
          initialRequirements={data.knowledgeApplication}
          onUpdate={handleKnowledgeApplicationChange}
          defaultStyles={[NumberingStyle.Numeric, NumberingStyle.Alphabetic, NumberingStyle.Roman]}
          showControls={true}
          showHelpPanel={true}
        />
      </div>
    </div>
  )
})

OutcomesAQF.displayName = 'OutcomesAQF'

export default OutcomesAQF
