import React from 'react'
import { Button } from '@/components/ui/button'
import { HelpCircle, FileUp } from 'lucide-react'
import StyleSelector from './StyleSelector'
import { NumberingStyle } from '@/types'

interface ControlPanelProps {
  defaultStyles: NumberingStyle[]
  onDefaultStyleChange: (level: number, newStyle: NumberingStyle) => void
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
        {defaultStyles.map((style, index) => (
          <StyleSelector
            key={index}
            level={index + 1}
            selectedStyle={style}
            onStyleChange={(newStyle) => onDefaultStyleChange(index + 1, newStyle)}
          />
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <Button
          onClick={onToggleHelp}
          variant="outline"
          size="sm"
          title="Show Help"
          className={'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          Help
        </Button>
        <Button
          onClick={onLoadPreset}
          variant="outline"
          size="sm"
          title="Load Preset Rules"
          className={'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500'}
        >
          <FileUp className="mr-2 h-4 w-4" />
          Load Preset
        </Button>
      </div>
    </div>
  )
}

export default ControlPanel
