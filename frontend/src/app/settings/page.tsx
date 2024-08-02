// app/settings/page.tsx
import Layout from '../../components/Layout';

export default function Settings() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">System Settings</h2>
      <form>
        <h3 className="text-xl font-bold mb-2">General Settings</h3>
        <div className="mb-4">
          <label className="block mb-1">University Name:</label>
          <input type="text" className="w-full p-2 border rounded" defaultValue="The University of Western Australia" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Current Academic Year:</label>
          <input type="text" className="w-full p-2 border rounded" defaultValue="2023-2024" />
        </div>

        <h3 className="text-xl font-bold mb-2">Document Generation</h3>
        <div className="mb-4">
          <label className="block mb-1">PDF Template:</label>
          <select className="w-full p-2 border rounded">
            <option>Template 1</option>
            <option selected>Template 2</option>
            <option>Template 3</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Handbook Format:</label>
          <select className="w-full p-2 border rounded">
            <option selected>PDF</option>
            <option>HTML</option>
            <option>DOCX</option>
          </select>
        </div>

        <h3 className="text-xl font-bold mb-2">User Management</h3>
        <div className="mb-4">
          <label className="block mb-1">Default User Role:</label>
          <select className="w-full p-2 border rounded">
            <option>Admin</option>
            <option selected>Editor</option>
            <option>Viewer</option>
          </select>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Save Settings</button>
      </form>
    </Layout>
  );
}