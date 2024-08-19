import React from 'react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { NumberingStyle } from './types'

interface NumberingStyleSelectorProps {
  level: string
  value: NumberingStyle
  onChange: (level: string, style: NumberingStyle) => void
}

const NumberingStyleSelector: React.FC<NumberingStyleSelectorProps> = ({
  level,
  value,
  onChange,
}) => {
  return (
    <div>
      <Label>Level {level} Numbering Style</Label>
      <Select onValueChange={(newValue) => onChange(level, newValue as NumberingStyle)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select style" defaultValue={value} />
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

export default NumberingStyleSelector
