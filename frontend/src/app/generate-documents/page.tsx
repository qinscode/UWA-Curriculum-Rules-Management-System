// app/generate-documents/page.tsx
import Layout from '../../components/Layout'

export default function GenerateDocuments() {
  return (
    <Layout>
      <h2 className="mb-4 text-2xl font-bold">Generate Documentation</h2>
      <div className="mb-8">
        <h3 className="mb-2 text-xl font-bold">Generate PDF for Specific Course</h3>
        <div className="flex space-x-2">
          <select className="flex-grow rounded border p-2">
            <option value="">Select a course</option>
            <option value="CS101">CS101 - Introduction to Programming</option>
            <option value="MATH201">MATH201 - Advanced Calculus</option>
          </select>
          <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            Generate Course PDF
          </button>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="mb-2 text-xl font-bold">Generate Complete Handbook</h3>
        <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Generate Full Handbook PDF
        </button>
      </div>
      <div>
        <h3 className="mb-2 text-xl font-bold">Export All Rules</h3>
        <button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
          Export Rules as JSON
        </button>
      </div>
    </Layout>
  )
}
