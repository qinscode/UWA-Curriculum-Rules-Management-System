import React from 'react'
import { NumberingStyle } from '@/types'

interface StyleSelectorProps {
  level: number
  selectedStyle: NumberingStyle
  onStyleChange: (newStyle: NumberingStyle) => void
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ level, selectedStyle, onStyleChange }) => {
  return (
    <div className="mb-2">
      <label className="mr-2 text-sm font-medium text-gray-700">Level {level} Style:</label>
      <select
        value={selectedStyle}
        onChange={(e) => onStyleChange(e.target.value as NumberingStyle)}
        className="rounded border px-2 py-1 text-sm"
      >
        <option value={NumberingStyle.Numeric}>Numeric</option>
        <option value={NumberingStyle.Alphabetic}>Alphabetic</option>
        <option value={NumberingStyle.Roman}>Roman</option>
        <option value={NumberingStyle.None}>None</option>
      </select>
    </div>
  )
}

export default StyleSelector
