import React from 'react'
import SelectMenu from './RulesSelectMenu'
import { styleOptions } from '@/types'

interface StyleSelectorProps {
  styles: string[]
  onStyleChange: (level: number, newStyle: string) => void
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, onStyleChange }) => {
  return (
    <div className="flex items-center space-x-4">
      {[1, 2, 3].map((level) => (
        <div key={level} className="flex items-center">
          <span className="mr-2 text-sm">Level {level} style:</span>
          <SelectMenu
            value={styles[level - 1]}
            onChange={(newStyle) => onStyleChange(level - 1, newStyle)}
            options={styleOptions}
          />
        </div>
      ))}
    </div>
  )
}

export default StyleSelector
