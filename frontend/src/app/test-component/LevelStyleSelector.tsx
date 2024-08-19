import React from 'react'
import { NumberingStyle } from './types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface LevelStyleSelectorProps {
  level: string
  value: NumberingStyle
  onChange: (level: string, style: NumberingStyle) => void
}

const LevelStyleSelector: React.FC<LevelStyleSelectorProps> = ({ level, value, onChange }) => {
  return (
    <div>
      <Label>Level {level} Style</Label>
      <Select
        value={value}
        onValueChange={(newValue) => onChange(`level${level}`, newValue as NumberingStyle)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select style" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={NumberingStyle.Numeric}>Numeric</SelectItem>
          <SelectItem value={NumberingStyle.Alphabetic}>Alphabetic</SelectItem>
          <SelectItem value={NumberingStyle.Roman}>Roman</SelectItem>
          <SelectItem value={NumberingStyle.None}>None</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default LevelStyleSelector
