import { Settings } from '@/types'
import { Input } from '@nextui-org/react'

interface GeneralSettingsProps {
  settings: {
    universityName: string
    academicYear: string
  }
  onChange: (newSettings: Partial<Settings>) => void
}

export function GeneralSettings({ settings, onChange }: GeneralSettingsProps) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">General Settings</h3>
      <Input
        label="University Name"
        defaultValue="The University of Western Australia"
        className="mb-4"
      />
      <Input label="Current Academic Year" defaultValue="2023-2024" />
    </div>
  )
}
