// app/generate-documents/page.tsx
import Layout from '../../components/Layout';

export default function GenerateDocuments() {
  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Generate Documentation</h2>
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Generate PDF for Specific Course</h3>
        <div className="flex space-x-2">
          <select className="flex-grow p-2 border rounded">
            <option value="">Select a course</option>
            <option value="CS101">CS101 - Introduction to Programming</option>
            <option value="MATH201">MATH201 - Advanced Calculus</option>
          </select>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Generate Course PDF</button>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-2">Generate Complete Handbook</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Generate Full Handbook PDF</button>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">Export All Rules</h3>
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Export Rules as JSON</button>
      </div>
    </Layout>
  );
}