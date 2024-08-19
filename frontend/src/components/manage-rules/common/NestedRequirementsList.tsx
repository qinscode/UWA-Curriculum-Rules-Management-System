import React, { useState } from 'react'
import { NestedRequirementsListProps } from '@/types'
import { useRequirements } from '@/hooks/useRequirements'

import BasePage from '@/components/manage-rules/common/SortedTree'

const NestedRequirementsList: React.FC<NestedRequirementsListProps> = ({
  initialRequirements = [],
  onChange,
  defaultStyles: propDefaultStyles = ['numeric', 'alphabetic', 'numeric'],
  showControls = true,
  showHelpPanel = true,
  addMainButtonText = 'Add Main Requirement',
  presetRules = [],
}) => {
  const {
    requirements,
    defaultStyles,
    showHelp,
    addRequirement,
    // updateRequirement,
    removeRequirement,
    addConnector,
    handleDefaultStyleChange,
    setShowHelp,
    onDragEnd,
    loadPresetRules,
  } = useRequirements(initialRequirements, propDefaultStyles, onChange, presetRules)

  const [useRequirement, setUseRequirement] = useState(initialRequirements)

  const handleAddChildNodeInParent = (parentId: number) => {
    console.log('Adding child node to parent ID:', parentId)
  }

  return (
    <div className="space-y-4">
      {/*{showControls && (*/}
      {/*  <HelpAndImport*/}
      {/*    defaultStyles={defaultStyles}*/}
      {/*    onDefaultStyleChange={handleDefaultStyleChange}*/}
      {/*    onToggleHelp={() => setShowHelp(!showHelp)}*/}
      {/*    onLoadPreset={loadPresetRules}*/}
      {/*  />*/}
      {/*)}*/}
      {/*{showHelpPanel && <HelpPanel showHelp={showHelp} />}*/}

      <BasePage
        initialData={useRequirement}
        onUpdateRequirement={setUseRequirement}
        onAddChildNode={handleAddChildNodeInParent}
        presetRequirements={presetRules}
      />
    </div>
  )
}

export default NestedRequirementsList
