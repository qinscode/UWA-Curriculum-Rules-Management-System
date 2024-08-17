import React from 'react'

interface OutcomesAQFProps {
  data: {
    aqfLevel?: string
    aqfQualificationType?: string
    knowledge?: string
    skills?: string
    applicationOfKnowledge?: string
  }
  updateData: (data: Partial<OutcomesAQFProps['data']>) => void
}

const OutcomesAQF: React.FC<OutcomesAQFProps> = ({ data, updateData }) => {
  return (
    <div className="mb-8 bg-white p-6 shadow-lg sm:rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">Outcomes & Australian Qualifications Framework</h3>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">AQF level</label>
        <textarea
          value={data.aqfLevel}
          onChange={(e) => updateData({ aqfLevel: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          AQF qualification type
        </label>
        <textarea
          value={data.aqfQualificationType}
          onChange={(e) => updateData({ aqfQualificationType: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Knowledge</label>
        <textarea
          value={data.knowledge}
          onChange={(e) => updateData({ knowledge: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={4}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Skills</label>
        <textarea
          value={data.skills}
          onChange={(e) => updateData({ skills: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={4}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Application of knowledge to skills
        </label>
        <textarea
          value={data.applicationOfKnowledge}
          onChange={(e) => updateData({ applicationOfKnowledge: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={4}
        />
      </div>
    </div>
  )
}

export default OutcomesAQF
