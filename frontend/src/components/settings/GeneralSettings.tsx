import { Settings } from '../../types'

interface GeneralSettingsProps {
  settings: Settings
  onChange: (newSettings: Partial<Settings>) => void
}

export function GeneralSettings({ settings, onChange }: GeneralSettingsProps): JSX.Element {
  return (
    <div>
      <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">General Settings</h3>
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            value={settings.theme}
            onChange={(e) => onChange({ theme: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={settings.language}
            onChange={(e) => onChange({ language: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
    </div>
  )
}
