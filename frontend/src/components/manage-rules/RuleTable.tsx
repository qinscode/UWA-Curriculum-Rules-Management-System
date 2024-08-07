// RuleTable.tsx
import React, { FC } from 'react'
import { PencilIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/solid'

interface Rule {
  id: number
  code: string
  name: string
  type: string
  description: string
}

interface RuleTableProps {
  rules: Rule[]
  onEdit: (rule: Rule) => void
  onDelete: (id: number) => void
  onShowHistory: (id: number) => void
}

const RuleTable: FC<RuleTableProps> = ({ rules, onEdit, onDelete, onShowHistory }) => {
  return (
    <div className="px-2 sm:px-4 lg:px-6">
      <div className="-mx-2 mt-8 overflow-x-auto sm:-mx-0">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-2 pr-1 text-left text-sm font-semibold text-gray-900 sm:pl-0 sm:pr-2"
              >
                Code / Name
              </th>
              <th
                scope="col"
                className="hidden px-1 py-3.5 text-left text-sm font-semibold text-gray-900 sm:px-2 md:table-cell"
              >
                Name
              </th>
              <th
                scope="col"
                className="hidden px-1 py-3.5 text-left text-sm font-semibold text-gray-900 sm:px-2 lg:table-cell"
              >
                Type
              </th>
              <th
                scope="col"
                className="max-w-xs px-1 py-3.5 text-left text-sm font-semibold text-gray-900 sm:px-2"
              >
                Description
              </th>
              <th
                scope="col"
                className="px-1 py-3.5 text-center text-sm font-semibold text-gray-900 sm:px-2"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td className="whitespace-nowrap py-4 pl-2 pr-1 text-sm font-medium text-gray-900 sm:pl-0 sm:pr-2">
                  {rule.code}
                  <dl className="font-normal md:hidden">
                    <dt className="sr-only">Name</dt>
                    <dd className="mt-1 truncate text-gray-700">{rule.name}</dd>
                    <dt className="sr-only mt-1 lg:hidden">Type</dt>
                    <dd className="mt-1 truncate text-gray-500 lg:hidden">{rule.type}</dd>
                  </dl>
                </td>
                <td className="hidden whitespace-nowrap px-1 py-4 text-sm text-gray-500 sm:px-2 md:table-cell">
                  {rule.name}
                </td>
                <td className="hidden whitespace-nowrap px-1 py-4 text-sm text-gray-500 sm:px-2 lg:table-cell">
                  {rule.type}
                </td>
                <td className="max-w-xs truncate px-1 py-4 text-sm text-gray-500 sm:px-0">
                  {rule.description}
                </td>
                <td className="whitespace-nowrap px-1 py-4 text-center text-sm font-medium sm:px-2">
                  <button
                    onClick={() => onEdit(rule)}
                    className="inline-flex items-center justify-center p-1 text-indigo-600 hover:text-indigo-900"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onDelete(rule.id)}
                    className="inline-flex items-center justify-center p-1 text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => onShowHistory(rule.id)}
                    className="inline-flex items-center justify-center p-1 text-green-600 hover:text-green-900"
                  >
                    <ClockIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RuleTable
