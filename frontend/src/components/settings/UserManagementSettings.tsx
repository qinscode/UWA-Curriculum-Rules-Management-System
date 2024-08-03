import { Select, SelectItem } from '@nextui-org/react'

import { Settings } from '../../types'

interface UserManagementSettingsProps {
  settings: Pick<Settings, 'defaultUserRole'>
  onChange: (newSettings: Partial<Pick<Settings, 'defaultUserRole'>>) => void
}

export function UserManagementSettings({ settings, onChange }: UserManagementSettingsProps) {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">User Management</h3>
      <Select label="Default User Role" defaultSelectedKeys={['editor']}>
        <SelectItem key="admin" value="admin">
          Admin
        </SelectItem>
        <SelectItem key="editor" value="editor">
          Editor
        </SelectItem>
        <SelectItem key="viewer" value="viewer">
          Viewer
        </SelectItem>
      </Select>
    </div>
  )
}
