import { FC } from 'react'

interface HandbookGeneratorProps {
  onGenerate: () => Promise<void>
  isGenerating: boolean
}

const HandbookGenerator: FC<HandbookGeneratorProps> = ({ onGenerate, isGenerating }) => {
  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Generate Complete Handbook</h3>
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
      >
        Generate Full Handbook PDF
      </button>
    </div>
  )
}

export default HandbookGenerator
