import React from 'react'
import SelectMenu from '@/components/generate-documents/SelectMenu'

interface DetailsProps {
  data: {
    code?: string
    title?: string
    awardTitle?: string
    degreeType?: string
    isNamedOrGeneric?: string
    about?: string
    abbreviation?: string
  }
  updateData: (data: Partial<DetailsProps['data']>) => void
}

const Details: React.FC<DetailsProps> = ({ data, updateData }) => {
  return (
    <div className="mb-8 bg-white p-6 shadow-lg sm:rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">Details</h3>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Code</label>
        <textarea
          value={data.code}
          onChange={(e) => updateData({ code: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
        <textarea
          value={data.title}
          onChange={(e) => updateData({ title: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Award Title</label>
        <textarea
          value={data.awardTitle}
          onChange={(e) => updateData({ awardTitle: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>

      <div className="mb-4">
        <SelectMenu
          label="Degree type"
          value={data.degreeType}
          onChange={(value) => updateData({ degreeType: value as string })}
          options={[
            { value: 'masters', label: "Master's (Coursework)" },
            { value: 'phd', label: 'PhD' },
            { value: 'bachelor', label: "Bachelor's" },
          ]}
        />
      </div>

      <div className="mb-4">
        <SelectMenu
          label="Is this a named or generic degree?"
          value={data.isNamedOrGeneric}
          onChange={(value) => updateData({ isNamedOrGeneric: value as string })}
          options={[
            { value: 'named', label: 'Named' },
            { value: 'generic', label: 'Generic' },
          ]}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">About this course</label>
        <textarea
          value={data.about}
          onChange={(e) => updateData({ about: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Proposed abbreviation of award conferred
        </label>
        <textarea
          value={data.abbreviation}
          onChange={(e) => updateData({ abbreviation: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>
    </div>
  )
}

export default Details
