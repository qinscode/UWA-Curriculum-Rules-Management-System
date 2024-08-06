import React from 'react'
import { Rule } from '@/types'
import { PencilIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/solid'

interface RuleTableProps {
  rules: Rule[]
  onEdit: (rule: Rule) => void
  onDelete: (id: number) => void
  onShowHistory: (id: number) => void
}

const RuleTable: React.FC<RuleTableProps> = ({ rules, onEdit, onDelete, onShowHistory }) => (
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
          description
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
          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{rule.description}</td>

          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
            <button
              onClick={() => onEdit(rule)}
              className="mr-2 text-indigo-600 hover:text-indigo-900"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(rule.id)}
              className="mr-2 text-red-600 hover:text-red-900"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => onShowHistory(rule.id)}
              className="text-green-600 hover:text-green-900"
            >
              <ClockIcon className="h-5 w-5" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default RuleTable
