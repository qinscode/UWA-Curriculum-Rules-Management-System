'use client'
// app/settings/page.tsx
import Layout from '../../components/Layout';
import { Input, Select, SelectItem, Button } from "@nextui-org/react";

export default function Settings() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">System Settings</h2>
      <form className="space-y-8">
        <div>
          <h3 className="text-xl font-bold mb-2">General Settings</h3>
          <Input label="University Name" defaultValue="The University of Western Australia" className="mb-4" />
          <Input label="Current Academic Year" defaultValue="2023-2024" />
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">Document Generation</h3>
          <Select label="PDF Template" defaultSelectedKeys={["template2"]} className="mb-4">
            <SelectItem key="template1" value="template1">Template 1</SelectItem>
            <SelectItem key="template2" value="template2">Template 2</SelectItem>
            <SelectItem key="template3" value="template3">Template 3</SelectItem>
          </Select>
          <Select label="Handbook Format" defaultSelectedKeys={["pdf"]}>
            <SelectItem key="pdf" value="pdf">PDF</SelectItem>
            <SelectItem key="html" value="html">HTML</SelectItem>
            <SelectItem key="docx" value="docx">DOCX</SelectItem>
          </Select>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">User Management</h3>
          <Select label="Default User Role" defaultSelectedKeys={["editor"]}>
            <SelectItem key="admin" value="admin">Admin</SelectItem>
            <SelectItem key="editor" value="editor">Editor</SelectItem>
            <SelectItem key="viewer" value="viewer">Viewer</SelectItem>
          </Select>
        </div>

        <Button color="primary" type="submit">Save Settings</Button>
      </form>
    </Layout>
  );
}