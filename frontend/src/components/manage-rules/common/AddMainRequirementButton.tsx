import React from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'

interface AddMainRequirementButtonProps {
  onClick: () => void
  text: string
}

const AddMainRequirementButton: React.FC<AddMainRequirementButtonProps> = ({ onClick, text }) => (
  <button
    onClick={onClick}
    className="mt-4 flex items-center rounded-md bg-indigo-600 px-4 py-1 text-white hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    <PlusIcon className="mr-2 h-5 w-5" />
    {text}
  </button>
)

export default AddMainRequirementButton
