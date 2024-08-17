import React from 'react'
import { format } from 'date-fns'

interface SchoolEndorsementProps {
  data: {
    headOfSchoolApproval?: boolean
    endorsementDetails?: string
    endorsementDate?: Date
    notes?: string
  }
  updateData: (data: Partial<SchoolEndorsementProps['data']>) => void
}

const SchoolEndorsement: React.FC<SchoolEndorsementProps> = ({ data, updateData }) => {
  return (
    <div className="mb-8 bg-white p-6 shadow-lg sm:rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">School Endorsement/approval</h3>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.headOfSchoolApproval}
            onChange={(e) => updateData({ headOfSchoolApproval: e.target.checked })}
            className="mr-2"
          />
          Proposal has been endorsed by the Head of School
        </label>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Endorsement Details</label>
        <textarea
          value={data.endorsementDetails}
          onChange={(e) => updateData({ endorsementDetails: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">Endorsement Date</label>
        <textarea
          value={data.endorsementDate ? format(data.endorsementDate, 'yyyy-MM-dd') : ''}
          onChange={(e) => updateData({ endorsementDate: new Date(e.target.value) })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={1}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Additional Notes</label>
        <textarea
          value={data.notes}
          onChange={(e) => updateData({ notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          rows={3}
        />
      </div>
    </div>
  )
}

export default SchoolEndorsement
