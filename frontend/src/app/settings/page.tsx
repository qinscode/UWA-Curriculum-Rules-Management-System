'use client'
import React, { useState, useEffect, FC } from 'react'
import Layout from '@/components/Layout'
import { useSettings } from '@/hooks/useSettings'
import { Settings, UpdateSettingsDTO } from '@/types'
import SelectMenu from '@/components/SelectMenu'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'

const SettingsPage: FC = () => {
  const { settings, isLoading, error, updateSettings } = useSettings()
  const [localSettings, setLocalSettings] = useState<Settings | null>(null)

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings)
    }
  }, [settings])

  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setLocalSettings((prev) => (prev ? { ...prev, ...newSettings } : null))
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!localSettings) return
    try {
      await updateSettings(localSettings as UpdateSettingsDTO)
      alert('Settings saved successfully')
    } catch (err) {
      console.error('Failed to save settings:', err)
    }
  }

  if (error) return <div className="py-4 text-red-600">Error: {error}</div>
  if (!localSettings) return <></>

  return (
    <Layout>
      <h2 className="mb-8 text-2xl font-bold text-gray-900">System Settings</h2>
      <form
        onSubmit={handleSaveSettings}
        className="mb-8 space-y-4 bg-white p-4 shadow sm:rounded-lg"
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <SelectMenu
                  label="Theme"
                  value={localSettings.theme}
                  onChange={(value) => handleSettingsChange({ theme: value })}
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                  ]}
                />
              </div>

              <div className="sm:col-span-4">
                <SelectMenu
                  label="Language"
                  value={localSettings.language}
                  onChange={(value) => handleSettingsChange({ language: value })}
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                  ]}
                />
              </div>

              {/* Add more settings fields based on your Settings type */}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </form>
    </Layout>
  )
}

export default SettingsPage
