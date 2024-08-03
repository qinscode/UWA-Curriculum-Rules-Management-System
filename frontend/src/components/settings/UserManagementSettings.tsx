import { Select, SelectItem } from "@nextui-org/react";

export function UserManagementSettings() {
    return (
        <div>
            <h3 className="text-xl font-bold mb-2">User Management</h3>
            <Select label="Default User Role" defaultSelectedKeys={["editor"]}>
                <SelectItem key="admin" value="admin">Admin</SelectItem>
                <SelectItem key="editor" value="editor">Editor</SelectItem>
                <SelectItem key="viewer" value="viewer">Viewer</SelectItem>
            </Select>
        </div>
    );
}