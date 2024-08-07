// RuleHistory.tsx
import React, { forwardRef } from 'react'
import { RuleHistoryDto } from '@/types'
import { XMarkIcon } from '@heroicons/react/24/solid'

interface RuleHistoryProps {
  history: RuleHistoryDto[]
  onClose: () => void
  onRestore: (ruleId: number, version: number) => void
}

const RuleHistory = forwardRef<HTMLDivElement, RuleHistoryProps>(
  ({ history, onClose, onRestore }, ref) => (
    <div ref={ref} className="mt-8 bg-white shadow-lg sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Rule History</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-200">
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <ul className="divide-y divide-gray-200">
          {history.map((version, index) => (
            <li key={index} className="py-4">
              <p className="text-sm font-medium text-gray-900">Version {version.version}</p>
              <p className="text-sm text-gray-500">
                {new Date(version.timestamp).toLocaleString()}
              </p>
              <p className="mt-1 text-sm text-gray-500">{version.description}</p>
              <button
                onClick={() => onRestore(version.ruleId, version.version)}
                className="mt-2 rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Restore
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
)

RuleHistory.displayName = 'RuleHistory'

export default RuleHistory
