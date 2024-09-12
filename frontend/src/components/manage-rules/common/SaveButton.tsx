import React, { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import useDebounce from '@/hooks/useDebounce'

interface SaveButtonProps {
  handleSaveButton?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  debounceTime?: number
}

const SaveButton: React.FC<SaveButtonProps> = ({
  handleSaveButton,
  disabled = false,
  debounceTime = 300,
}: SaveButtonProps) => {
  const debouncedSave = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (handleSaveButton) {
        handleSaveButton(e)
      }
    },
    [handleSaveButton]
  )

  const handleDebouncedSave = useDebounce(debouncedSave, debounceTime)

  return (
    <div className="mt-8 flex justify-end">
      <Button
        type="button"
        className="bg-blue-800 text-white shadow-sm hover:bg-black disabled:cursor-not-allowed disabled:bg-blue-300"
        onClick={handleDebouncedSave}
        disabled={disabled}
      >
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </div>
  )
}

export default SaveButton
