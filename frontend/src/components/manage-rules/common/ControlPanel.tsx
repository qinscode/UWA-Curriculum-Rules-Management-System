import React from 'react'
import { QuestionMarkCircleIcon, ArrowRightEndOnRectangleIcon } from '@heroicons/react/20/solid'
import StyleSelector from './StyleSelector'

interface ControlPanelProps {
  defaultStyles: string[]
  onDefaultStyleChange: (level: number, newStyle: string) => void
  onToggleHelp: () => void
  onLoadPreset: () => void
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  defaultStyles,
  onDefaultStyleChange,
  onToggleHelp,
  onLoadPreset,
}) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-700">Default Styles:</h3>
        <StyleSelector styles={defaultStyles} onStyleChange={onDefaultStyleChange} />
      </div>
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
          <ArrowRightEndOnRectangleIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}

export default ControlPanel
