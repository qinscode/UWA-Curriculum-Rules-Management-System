import React, { FC } from 'react'
import { ArrowDownTrayIcon } from '@heroicons/react/24/solid'

interface ExportRulesSectionProps {
  exportRules: () => void
  isGenerating: boolean
}

const ExportRulesSection: FC<ExportRulesSectionProps> = ({ exportRules, isGenerating }) => {
  return (
    <div className="rounded-lg border border-gray-200 p-6 shadow-lg">
      {' '}
      {/* Added Shadow, Border, and Padding */}
      <h3 className="text-base font-semibold leading-7 text-gray-900">Export Rules</h3>
      <p className="mt-1 text-sm leading-6 text-gray-600">
        Export all rules as a JSON file for backup or integration purposes.
      </p>
      <div className="mt-6">
        <button
          onClick={exportRules}
          disabled={isGenerating}
          className="flex w-full items-center justify-center rounded-md bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 sm:w-auto"
        >
          <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
          Export Rules as JSON
        </button>
      </div>
    </div>
  )
}

export default ExportRulesSection
