import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { NumberingStyle } from '@/app/test-component/types'
import TreeView from '@/app/test-component/TreeView'
import React from 'react'

interface StyleSelectorProps {
  handleStyleChange
  levelStyles
  items
  handleItemsChange
}
export const StyleSelector: React.FC<StyleSelectorProps> = (props) => {
  const { handleStyleChange, levelStyles, handleItemsChange, items } = props
  return (
    <div className="p-4">
      <div className="mb-4 flex space-x-4">
        <div>
          <Label>Level 1 Style</Label>
          <Select onValueChange={(value) => handleStyleChange('level1', value as NumberingStyle)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select style" defaultValue={levelStyles.level1} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NumberingStyle.Numeric}>Numeric</SelectItem>
              <SelectItem value={NumberingStyle.Alphabetic}>Alphabetic</SelectItem>
              <SelectItem value={NumberingStyle.Roman}>Roman</SelectItem>
              <SelectItem value={NumberingStyle.None}>None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Level 2 Style</Label>
          <Select onValueChange={(value) => handleStyleChange('level2', value as NumberingStyle)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select style" defaultValue={levelStyles.level2} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NumberingStyle.Numeric}>Numeric</SelectItem>
              <SelectItem value={NumberingStyle.Alphabetic}>Alphabetic</SelectItem>
              <SelectItem value={NumberingStyle.Roman}>Roman</SelectItem>
              <SelectItem value={NumberingStyle.None}>None</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Level 3 Style</Label>
          <Select onValueChange={(value) => handleStyleChange('level3', value as NumberingStyle)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select style" defaultValue={levelStyles.level3} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NumberingStyle.Numeric}>Numeric</SelectItem>
              <SelectItem value={NumberingStyle.Alphabetic}>Alphabetic</SelectItem>
              <SelectItem value={NumberingStyle.Roman}>Roman</SelectItem>
              <SelectItem value={NumberingStyle.None}>None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <TreeView items={items} onItemsChanged={handleItemsChange} />
    </div>
  )
}
