'use client'
import React, { useState } from 'react'
import Layout from '@/components/Layout'
import SelectMenu from '@/components/SelectMenu'
import { useRules } from '@/hooks/useRules'
import { CreateRuleDTO, Rule } from '@/types'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'

export default function ManageRules(): JSX.Element {
  const { rules, isLoading, error, addRule, deleteRule } = useRules()
  const [newRule, setNewRule] = useState<CreateRuleDTO>({
    code: '',
    name: '',
    type: 'standard',
    description: '',
  })

  const handleAddRule = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await addRule(newRule)
      setNewRule({ code: '', name: '', type: 'standard', description: '' })
    } catch (err) {
      console.error('Failed to add rule:', err)
    }
  }

  const handleDeleteRule = async (id: number) => {
    try {
      await deleteRule(id)
    } catch (err) {
      console.error('Failed to delete rule:', err)
    }
  }

  if (isLoading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-red-600">Error: {error}</div>

  return (
    <Layout>
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Manage Course Rules</h2>
      <form onSubmit={handleAddRule} className="mb-8 space-y-4 bg-white p-4 shadow sm:rounded-lg">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">
                  Course Code
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="code"
                    id="code"
                    value={newRule.code}
                    onChange={(e) => setNewRule({ ...newRule, code: e.target.value })}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Course Name
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={newRule.name}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <SelectMenu
                  label="Course Type"
                  value={newRule.type}
                  onChange={(value) => setNewRule({ ...newRule, type: value })}
                  options={[
                    { value: 'standard', label: 'Standard' },
                    { value: 'custom', label: 'Custom' },
                  ]}
                />
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={newRule.description}
                    onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Rule
          </button>
        </div>
      </form>

      <h3 className="mb-4 text-xl font-bold text-gray-900">Existing Rules</h3>
      <div className="bg-white shadow sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Code
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {rule.code}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{rule.name}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{rule.type}</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
