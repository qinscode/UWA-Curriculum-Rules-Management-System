import { useState, useEffect, FC } from 'react'
import { Rule } from '@/types'
import { apiClient } from '@/lib/api-client'

interface CoursePDFGeneratorProps {
  onGenerate: (courseId: string) => Promise<void>
  isGenerating: boolean
}

const CoursePDFGenerator: FC<CoursePDFGeneratorProps> = ({ onGenerate, isGenerating }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [rules, setRules] = useState<Rule[]>([])

  // useEffect(() => {
  //   const fetchRules = async () => {
  //     try {
  //       const data = await apiClient.getRules()
  //       setRules(data)
  //     } catch (error) {
  //       console.error('Failed to fetch rules:', error)
  //     }
  //   }

  //   fetchRules()
  // }, [])

  const handleGenerate = () => {
    if (selectedCourse) {
      onGenerate(selectedCourse)
    }
  }

  return (
    <div>
      <h3 className="mb-2 text-xl font-bold">Generate PDF for Specific Course</h3>
      <div className="flex space-x-2">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="mt-1 block w-full flex-grow rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Choose a course</option>
          {rules.map((rule) => (
            <option key={rule.id} value={rule.id.toString()}>
              {rule.code} - {rule.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !selectedCourse}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Generate Course PDF
        </button>
      </div>
    </div>
  )
}

export default CoursePDFGenerator
