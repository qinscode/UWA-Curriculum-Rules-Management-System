import React from 'react'

interface ArticulationAgreementProps {
  data: {
    hasArticulationAgreement?: boolean
  }
  updateData: (data: Partial<ArticulationAgreementProps['data']>) => void
}

const ArticulationAgreement: React.FC<ArticulationAgreementProps> = ({ data, updateData }) => {
  return (
    <div className="mb-8 bg-white p-6 shadow-lg sm:rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">Articulation Agreement</h3>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={data.hasArticulationAgreement}
            onChange={(e) => updateData({ hasArticulationAgreement: e.target.checked })}
            className="mr-2"
          />
          Yes, an Articulation Agreement exists with an external University for this course
        </label>
      </div>
    </div>
  )
}

export default ArticulationAgreement
