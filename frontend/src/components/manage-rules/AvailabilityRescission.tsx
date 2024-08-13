import React from 'react'
import SelectMenu from '@/components/SelectMenu'

interface AvailabilityRescissionProps {
  data: {
    availability?: string
  }
  updateData: (data: Partial<AvailabilityRescissionProps['data']>) => void
}

const AvailabilityRescission: React.FC<AvailabilityRescissionProps> = ({ data, updateData }) => {
  return (
    <div className="mb-8 bg-white p-6 shadow-lg sm:rounded-lg">
      <h3 className="mb-4 text-lg font-semibold">Availability and rescission</h3>

      <div className="mb-4">
        <SelectMenu
          label="Availability of course for 2024"
          value={data.availability}
          onChange={(value) => updateData({})}
          options={[
            { value: 'available', label: 'Available for new enrolments' },
            { value: 'unavailable', label: 'Not available for new enrolments' },
            { value: 'exit', label: 'Exit award only' },
          ]}
        />
      </div>
    </div>
  )
}

export default AvailabilityRescission
