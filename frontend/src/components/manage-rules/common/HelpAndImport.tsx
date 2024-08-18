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
        <StyleSelector styles={defaultStyles} onStyleChange={onDefaultStyleChange} />
      </div>
      <div className="flex items-center space-x-4">
        <Button
          onClick={onToggleHelp}
          variant="outline"
          size="sm"
          title="Show Help"
          className={'bg-indigo-600'}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          Help
        </Button>
        <Button onClick={onLoadPreset} variant="outline" size="sm" title="Load Preset Rules">
          <FileUp className="mr-2 h-4 w-4" />
          Load Preset
        </Button>
      </div>
    </div>
  )
}

export default HelpAndImport
