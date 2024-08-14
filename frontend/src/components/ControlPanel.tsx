import React from 'react'
import { QuestionMarkCircleIcon, DocumentTextIcon } from '@heroicons/react/20/solid'
import StyleSelector from './StyleSelector'

interface ControlPanelProps {
  styles: string[]
  onStyleChange: (level: number, newStyle: string) => void
  onToggleHelp: () => void
  onLoadPreset: () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  styles,
  onStyleChange,
  onToggleHelp,
  onLoadPreset,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <StyleSelector styles={styles} onStyleChange={onStyleChange} />
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleHelp}
          className="p-2 text-blue-600 hover:text-blue-800 focus:outline-none"
          title="Show Help"
        >
          <QuestionMarkCircleIcon className="h-6 w-6" />
        </button>
        <button
          onClick={onLoadPreset}
          className="p-2 text-green-600 hover:text-green-800 focus:outline-none"
          title="Load Preset Rules"
        >
          <DocumentTextIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

export default ControlPanel
