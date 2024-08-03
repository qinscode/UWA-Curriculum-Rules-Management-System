'use client'
import Layout from '../../components/Layout'
import { PageHeader } from '../../components/PageHeader'
import { GeneralSettings } from '../../components/settings/GeneralSettings'
import { DocumentSettings } from '../../components/settings/DocumentSettings'
import { UserManagementSettings } from '../../components/settings/UserManagementSettings'
import { Button } from '@nextui-org/react'
import { useSettings } from '../../hooks/useSettings'
import { Settings } from '../../types'
import { useState } from 'react'

export default function Settings() {
  const { settings, isLoading, error, updateSettings } = useSettings()
  const [localSettings, setLocalSettings] = useState<Settings | null>(settings)

  const handleSettingsChange = (newSettings: Partial<Settings>) => {
    setLocalSettings((prev) => (prev ? { ...prev, ...newSettings } : null))
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!settings) return
    try {
      await updateSettings(settings)
      alert('Settings saved successfully')
    } catch (err) {
      console.error('Failed to save settings:', err)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!settings) return null

  return (
    <Layout>
      <PageHeader title="System Settings" />
      <form onSubmit={handleSaveSettings} className="space-y-8">
        <GeneralSettings settings={settings} onChange={handleSettingsChange} />
        <DocumentSettings settings={settings} onChange={handleSettingsChange} />
        <UserManagementSettings settings={settings} onChange={handleSettingsChange} />
        <Button color="primary" type="submit">
          Save Settings
        </Button>
      </form>
    </Layout>
  )
}
