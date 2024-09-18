import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

const PresetRule: React.FC = () => {
  const presetRules = ['Rule 1: Must have 75% average', 'Rule 2: Complete 6 core units']

  return (
    <Card className="mb-6 shadow-lg">
      <CardContent>
        <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">Current Preset Rules</h3>
        {/* Add Warining message*/}
        <p className="mb-4 text-sm text-red-600">
          This is for presentation only, any modifications need admin access.
        </p>
        <ul className="list-disc pl-5">
          {presetRules.map((rule, index) => (
            <li key={index} className="text-gray-700">
              {rule}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default PresetRule
