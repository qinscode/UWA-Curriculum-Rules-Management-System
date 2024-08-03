import { Select, SelectItem } from '@nextui-org/react'

export function UserManagementSettings() {
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
