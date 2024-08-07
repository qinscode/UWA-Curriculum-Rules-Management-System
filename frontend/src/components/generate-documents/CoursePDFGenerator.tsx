import React, { useState, useEffect, FC } from 'react'
import { Rule } from '@/types'
import { apiClient } from '@/lib/api-client'

interface CoursePDFGeneratorProps {
  onGenerate: (courseId: string) => Promise<string>
  isGenerating: boolean
}

const CoursePDFGenerator: FC<CoursePDFGeneratorProps> = ({ onGenerate, isGenerating }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [rules, setRules] = useState<Rule[]>([])
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalRules, setTotalRules] = useState(0)

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const { rules: fetchedRules, total } = await apiClient.getRules(page, 100) // Fetching 100 rules per page
        setRules(fetchedRules)
        setTotalRules(total)
      } catch (error) {
        console.error('Failed to fetch rules:', error)
      }
    }

    fetchRules()
  }, [page])

  const handleGenerate = async () => {
    if (selectedCourse) {
      try {
        const { url } = await apiClient.generateCoursePDF(selectedCourse)
        console.log('PDF URL:', url)
        setPdfUrl(url)
      } catch (error) {
        console.error('Failed to generate PDF:', error)
        alert('Failed to generate PDF. Please try again.')
      }
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Generate PDF for Specific Course</h3>
      <div className="flex space-x-2">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
          {isGenerating ? 'Generating...' : 'Generate Course PDF'}
        </button>
      </div>
      {pdfUrl && (
        <div className="mt-4">
          <a
            href={pdfUrl}
            download={`course_${selectedCourse}_rules.pdf`}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Download PDF
          </a>
        </div>
      )}
      {totalRules > rules.length && (
        <div className="mt-4">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Load More Rules
          </button>
        </div>
      )}
    </div>
  )
}

export default CoursePDFGenerator
