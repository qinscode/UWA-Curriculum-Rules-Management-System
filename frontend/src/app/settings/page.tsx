// app/settings/page.tsx
import Layout from '../../components/Layout'

export default function Settings() {
  return (
    <Layout>
      <h2 className="mb-4 text-2xl font-bold">System Settings</h2>
      <form>
        <h3 className="mb-2 text-xl font-bold">General Settings</h3>
        <div className="mb-4">
          <label className="mb-1 block">University Name:</label>
          <input
            type="text"
            className="w-full rounded border p-2"
            defaultValue="The University of Western Australia"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block">Current Academic Year:</label>
          <input type="text" className="w-full rounded border p-2" defaultValue="2023-2024" />
        </div>

        <h3 className="mb-2 text-xl font-bold">Document Generation</h3>
        <div className="mb-4">
          <label className="mb-1 block">PDF Template:</label>
          <select className="w-full rounded border p-2">
            <option>Template 1</option>
            <option selected>Template 2</option>
            <option>Template 3</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="mb-1 block">Handbook Format:</label>
          <select className="w-full rounded border p-2">
            <option selected>PDF</option>
            <option>HTML</option>
            <option>DOCX</option>
          </select>
        </div>

        <h3 className="mb-2 text-xl font-bold">User Management</h3>
        <div className="mb-4">
          <label className="mb-1 block">Default User Role:</label>
          <select className="w-full rounded border p-2">
            <option>Admin</option>
            <option selected>Editor</option>
            <option>Viewer</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          Save Settings
        </button>
      </form>
    </Layout>
  )
}
