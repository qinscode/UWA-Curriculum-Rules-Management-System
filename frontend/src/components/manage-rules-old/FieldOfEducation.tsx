import React from 'react'
import SelectMenu from '@/components/generate-documents/SelectMenu'

interface FieldOfEducationProps {
  data: {
    broadField?: string
    narrowField?: string
    detailedField?: string
  }
  updateData: (data: Partial<FieldOfEducationProps['data']>) => void
}

const FieldOfEducation: React.FC<FieldOfEducationProps> = ({ data, updateData }) => {
  return (
    <div className="mb-8 bg-white p-6 shadow-lg sm:rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">Field of Education</h3>

      <div className="mb-4">
        <SelectMenu
          label="Broad Field of Education"
          value={data.broadField}
          onChange={(value) => updateData({ broadField: value as string })}
          options={[
            { value: '08', label: '08 - Management and Commerce' },
            // Add more options as needed
          ]}
          placeholder="Click to view and select from the list of broad fields of education"
        />
      </div>

      <div className="mb-4">
        <SelectMenu
          label="Narrow Field of Education"
          value={data.narrowField}
          onChange={(value) => updateData({ narrowField: value as string })}
          options={[
            { value: '0800', label: '0800 - Management and Commerce' },
            // Add more options as needed
          ]}
          placeholder="Click to view and select from the list of narrow fields of education"
        />
      </div>

      <div className="mb-4">
        <SelectMenu
          label="Detailed Field of Education"
          value={data.detailedField}
          onChange={(value) => updateData({ detailedField: value as string })}
          options={[
            { value: '080000', label: '080000 - Management and Commerce' },
            // Add more options as needed
          ]}
          placeholder="Click to view and select from the list of detailed fields of education"
        />
      </div>
    </div>
  )
}

export default FieldOfEducation
