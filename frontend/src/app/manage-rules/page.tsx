// app/manage-rules/page.tsx
'use client'
import { useState } from 'react'
import Layout from '../../components/Layout'

export default function ManageRules() {
  const [rules, setRules] = useState([
    { code: 'CS101', name: 'Introduction to Programming', type: 'Standard' },
    { code: 'MATH201', name: 'Advanced Calculus', type: 'Custom' },
  ])

  return (
    <Layout>
      <h2 className="mb-4 text-2xl font-bold">Manage Course Rules</h2>
      <form className="mb-8">
        <select className="mb-4 w-full rounded border p-2" defaultValue="">
          <option value="" disabled>
            Select Course Type
          </option>
          <option value="standard">Standard</option>
          <option value="custom">Custom</option>
        </select>
        <input type="text" placeholder="Course Code" className="mb-4 w-full rounded border p-2" />
        <input type="text" placeholder="Course Name" className="mb-4 w-full rounded border p-2" />
        <textarea
          placeholder="Course Description"
          className="mb-4 w-full rounded border p-2"
          rows={3}
        ></textarea>
        <textarea
          placeholder="Enter course rules..."
          className="mb-4 w-full rounded border p-2"
          rows={5}
        ></textarea>
        <button
          type="submit"
          className="w-full rounded bg-blue-500 p-2 text-white hover:bg-blue-600"
        >
          Save Rules
        </button>
      </form>

      <h3 className="mb-4 text-xl font-bold">Existing Rules</h3>
      <table className="w-full">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th className="p-2 text-left">Course Code</th>
            <th className="p-2 text-left">Course Name</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
              <td className="p-2">{rule.code}</td>
              <td className="p-2">{rule.name}</td>
              <td className="p-2">{rule.type}</td>
              <td className="p-2">
                <button className="mr-2 rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600">
                  Edit
                </button>
                <button className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  )
}
