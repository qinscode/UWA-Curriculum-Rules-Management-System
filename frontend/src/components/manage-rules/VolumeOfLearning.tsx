import React from 'react'
import SelectMenu from '@/components/SelectMenu'

interface VolumeOfLearningProps {
  data: {
    minVolume?: string
    maxVolume?: string
    conversionUnitTypes?: string[]
    conversionUnitCount?: number
  }
  updateData: (data: Partial<VolumeOfLearningProps['data']>) => void
}

const VolumeOfLearning: React.FC<VolumeOfLearningProps> = ({ data, updateData }) => {
  return (
    <div className="mb-8 bg-white p-6 shadow-lg sm:rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">Volume of learning</h3>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Minimum volume of learning of the course
        </label>
        <textarea
          value={data.minVolume}
          onChange={(e) => updateData({ minVolume: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Maximum volume of learning of the course
        </label>
        <textarea
          value={data.maxVolume}
          onChange={(e) => updateData({ maxVolume: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>

      <div className="mb-4">
        <SelectMenu
          label="Which type(s) of conversion units does the proposed course include?"
          value={data.conversionUnitTypes || []}
          onChange={(value) => updateData({ conversionUnitTypes: value as string[] })}
          options={[
            { value: 'undergraduate', label: 'Undergraduate units (Level 1 - Level 3)' },
            { value: 'postgraduate', label: 'Postgraduate units (Level 4 or Level 5)' },
            { value: 'additional', label: 'Additional Level 4 or/and Level 5 units' },
          ]}
          multiple={true}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Number of conversion units
        </label>
        <textarea
          value={data.conversionUnitCount?.toString() || ''}
          onChange={(e) =>
            updateData({ conversionUnitCount: parseInt(e.target.value) || undefined })
          }
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>
    </div>
  )
}

export default VolumeOfLearning
