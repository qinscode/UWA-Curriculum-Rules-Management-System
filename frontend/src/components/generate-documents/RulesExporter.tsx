import { FC } from 'react'

interface RulesExporterProps {
  onExport: () => Promise<void>
  isGenerating: boolean
}

const RulesExporter: FC<RulesExporterProps> = ({ onExport, isGenerating }) => {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Export All Rules</h3>
      <button
        onClick={onExport}
        disabled={isGenerating}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        Export Rules as JSON
      </button>
    </div>
  )
}

export default RulesExporter
