import React from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

interface AddMainRequirementButtonProps {
  onClick: () => void
  text: string
}

const AddMainRequirementButton: React.FC<AddMainRequirementButtonProps> = ({ onClick, text }) => (
  <Button onClick={onClick} variant="outline" className="mt-4 w-full">
    <Plus className="mr-2 h-4 w-4" />
    {text}
  </Button>
)

export default AddMainRequirementButton
