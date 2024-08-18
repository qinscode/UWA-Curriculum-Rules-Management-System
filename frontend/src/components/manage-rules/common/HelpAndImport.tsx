import React from 'react'
import { Button } from '@/components/ui/button'
import { HelpCircle, FileUp } from 'lucide-react'
import StyleSelector from './StyleSelector'

interface ControlPanelProps {
  defaultStyles: string[]
  onDefaultStyleChange: (level: number, newStyle: string) => void
  onToggleHelp: () => void
  onLoadPreset: () => void
}

const HelpAndImport: React.FC<ControlPanelProps> = ({
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
        <Button onClick={onToggleHelp} variant="outline" size="icon" title="Show Help">
          <HelpCircle className="h-4 w-4" />
        </Button>
        <Button onClick={onLoadPreset} variant="outline" size="icon" title="Load Preset Rules">
          <FileUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default HelpAndImport
