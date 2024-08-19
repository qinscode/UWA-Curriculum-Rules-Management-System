import React from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import { Button } from '@/components/ui/button'
import { NestedRequirementsListProps } from '@/types'
import { useRequirements } from '@/hooks/useRequirements'
import RequirementTreeView from './RequirementTreeView'
import HelpAndImport from './HelpAndImport'
import HelpPanel from './HelpPanel'
import { Plus } from 'lucide-react'
import { SortableTree } from 'dnd-kit-sortable-tree'

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
    updateRequirement,
    removeRequirement,
    addConnector,
    handleDefaultStyleChange,
    setShowHelp,
    onDragEnd,
    loadPresetRules,
  } = useRequirements(initialRequirements, propDefaultStyles, onChange, presetRules)

  return (
    <div className="space-y-4">
      {showControls && (
        <HelpAndImport
          defaultStyles={defaultStyles}
          onDefaultStyleChange={handleDefaultStyleChange}
          onToggleHelp={() => setShowHelp(!showHelp)}
          onLoadPreset={loadPresetRules}
        />
      )}
      {showHelpPanel && <HelpPanel showHelp={showHelp} />}
      <RequirementTreeView
        requirements={requirements}
        defaultStyles={defaultStyles}
        onUpdateRequirement={updateRequirement}
        onRemoveRequirement={removeRequirement}
        onAddRequirement={addRequirement}
        onAddConnector={addConnector}
      />
      <Button
        onClick={() => addRequirement()}
        variant="outline"
        className={'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'}
      >
        <Plus className="mr-2 h-4 w-4" />
        {addMainButtonText}
      </Button>
    </div>
  )
}

export default NestedRequirementsList
