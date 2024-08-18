import React from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { AdmissionSelectionProps } from '@/types'

const AdditionalRules: React.FC<AdmissionSelectionProps> = ({ data, updateData }) => {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="additionalRules" className="mb-1 block text-lg font-medium">
          Additional Rules
        </Label>
        <Textarea
          id="additionalRules"
          placeholder="Enter any additional rules or requirements for this course..."
          value={data.additionalRules || ''}
          onChange={(e) => updateData({ additionalRules: e.target.value })}
          className="min-h-[150px]"
        />
      </div>
    </div>
  )
}

export default AdditionalRules
