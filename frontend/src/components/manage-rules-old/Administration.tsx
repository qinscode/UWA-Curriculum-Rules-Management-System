import React from 'react'
import SelectMenu from '@/components/generate-documents/SelectMenu'

interface AdministrationProps {
  data: {
    school?: string
    responsibleEntity?: string
    collaborations?: string[]
    coordinator?: string
    isContingency?: boolean
  }
  updateData: (data: Partial<AdministrationProps['data']>) => void
}

const Administration: React.FC<AdministrationProps> = ({ data, updateData }) => {
  return (
    <div className="mb-8 bg-white p-6 shadow-lg sm:rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">Administration</h3>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">School</label>
        <textarea
          value={data.school}
          onChange={(e) => updateData({ school: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Responsible Organisational Entity
        </label>
        <textarea
          value={data.responsibleEntity}
          onChange={(e) => updateData({ responsibleEntity: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          School Collaborations
        </label>
        <textarea
          value={data.collaborations?.join(', ')}
          onChange={(e) => updateData({ collaborations: e.target.value.split(', ') })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={2}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Coordinator</label>
        <textarea
          value={data.coordinator}
          onChange={(e) => updateData({ coordinator: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.isContingency}
            onChange={(e) => updateData({ isContingency: e.target.checked })}
            className="mr-2"
          />
          Is this a Contingency Course
        </label>
      </div>
    </div>
  )
}

export default Administration
