import React from 'react'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

const SaveButton: React.FC = () => {
  return (
    <div className="mt-8 flex justify-end">
      <Button type="submit" className="bg-indigo-600 text-white shadow-sm hover:bg-indigo-500">
        <Save className="mr-2 h-4 w-4" />
        Save Changes
      </Button>
    </div>
  )
}

export default SaveButton
