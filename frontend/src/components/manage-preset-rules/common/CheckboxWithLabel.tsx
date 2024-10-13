import React from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface CheckboxWithLabelProps {
  id: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  id,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={id} checked={checked} onCheckedChange={onChange} />
      <Label htmlFor={id} className="text-sm text-gray-500">
        {description}
      </Label>
    </div>
  )
}

export default CheckboxWithLabel
