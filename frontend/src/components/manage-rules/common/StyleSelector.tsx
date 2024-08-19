import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { styleOptions } from '@/types'

interface StyleSelectorProps {
  styles: string[]
  onStyleChange: (level: number, newStyle: string) => void
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, onStyleChange }) => {
  return (
    <div className="flex items-center space-x-4">
      {[1, 2, 3].map((level) => (
        <div key={level} className="flex flex-col space-y-1">
          <Label htmlFor={`level-${level}-style`} className="text-sm">
            Level {level} style:
          </Label>
          <Select
            value={styles[level - 1]}
            onValueChange={(newStyle) => onStyleChange(level, newStyle)}
          >
            <SelectTrigger id={`level-${level}-style`} className="w-[130px]">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {styleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  )
}

export default StyleSelector
