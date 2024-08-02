// app/manage-rules/page.tsx
'use client'
import { useState } from 'react';
import Layout from '../../components/Layout';

export default function ManageRules() {
  const [rules, setRules] = useState([
    { code: 'CS101', name: 'Introduction to Programming', type: 'Standard' },
    { code: 'MATH201', name: 'Advanced Calculus', type: 'Custom' },
  ]);

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Manage Course Rules</h2>
      <form className="mb-8">
        <select className="w-full p-2 mb-4 border rounded" defaultValue="">
          <option value="" disabled>Select Course Type</option>
          <option value="standard">Standard</option>
          <option value="custom">Custom</option>
        </select>
        <input type="text" placeholder="Course Code" className="w-full p-2 mb-4 border rounded" />
        <input type="text" placeholder="Course Name" className="w-full p-2 mb-4 border rounded" />
        <textarea placeholder="Course Description" className="w-full p-2 mb-4 border rounded" rows={3}></textarea>
        <textarea placeholder="Enter course rules..." className="w-full p-2 mb-4 border rounded" rows={5}></textarea>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Save Rules</button>
      </form>

      <h3 className="text-xl font-bold mb-4">Existing Rules</h3>
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
                <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600">Edit</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}