import React from 'react'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

interface SaveButtonProps {
  handleSaveButton?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
}

const SaveButton: React.FC<SaveButtonProps> = ({
  handleSaveButton,
  disabled = false,
}: SaveButtonProps) => {
  return (
    <div className="mt-8 flex justify-end">
      <Button
        type="button"
        className="bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
        onClick={handleSaveButton}
        disabled={disabled}
      >
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </div>
  )
}

export default SaveButton
