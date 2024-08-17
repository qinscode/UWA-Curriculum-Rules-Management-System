import React from 'react'

interface CheckboxWithLabelProps {
  id: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  id,
  description,
  checked,
  onChange,
}) => {
  return (
    <div className="relative flex items-start">
      <div className="flex h-5 items-center">
        <input
          id={id}
          aria-describedby={`${id}-description`}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      </div>
      <div className="ml-3 text-sm">
        {description && (
          <p id={`${id}-description`} className="text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export default CheckboxWithLabel
