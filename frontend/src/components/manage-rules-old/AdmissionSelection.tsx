import React from 'react'

interface AdmissionSelectionProps {
  data: {
    englishRequirements?: string
    admissionRequirements?: string
    rankingSelection?: string
    satisfactoryProgress?: boolean
    progressStatus?: string
    awardWithDistinction?: boolean
    deferralAllowed?: boolean
    deferralRules?: string
  }
  updateData: (data: Partial<AdmissionSelectionProps['data']>) => void
}

const AdmissionSelection: React.FC<AdmissionSelectionProps> = ({ data, updateData }) => {
  return (
    <div className="mb-8 bg-white p-6 shadow-lg sm:rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">Admission and selection</h3>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          English language eligibility requirements
        </label>
        <textarea
          value={data.englishRequirements}
          onChange={(e) => updateData({ englishRequirements: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Admission Requirements
        </label>
        <textarea
          value={data.admissionRequirements}
          onChange={(e) => updateData({ admissionRequirements: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Ranking and selection for admission
        </label>
        <textarea
          value={data.rankingSelection}
          onChange={(e) => updateData({ rankingSelection: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.satisfactoryProgress}
            onChange={(e) => updateData({ satisfactoryProgress: e.target.checked })}
            className="mr-2"
          />
          Satisfactory progress differs from University Policy
        </label>
      </div>

      {data.satisfactoryProgress && (
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Progress status rule
          </label>
          <textarea
            value={data.progressStatus}
            onChange={(e) => updateData({ progressStatus: e.target.value })}
            className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            rows={3}
          />
        </div>
      )}

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.awardWithDistinction}
            onChange={(e) => updateData({ awardWithDistinction: e.target.checked })}
            className="mr-2"
          />
          Exemption sought for award with distinction
        </label>
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.deferralAllowed}
            onChange={(e) => updateData({ deferralAllowed: e.target.checked })}
            className="mr-2"
          />
          Applicants are entitled to defer an offered place for up to one year
        </label>
      </div>

      {data.deferralAllowed && (
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-gray-700">Deferment rules</label>
          <textarea
            value={data.deferralRules}
            onChange={(e) => updateData({ deferralRules: e.target.value })}
            className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            rows={3}
          />
        </div>
      )}
    </div>
  )
}

export default AdmissionSelection
