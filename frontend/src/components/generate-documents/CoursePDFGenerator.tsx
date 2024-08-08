import React, { useState, FC } from 'react'
import SelectMenu from '@/components/SelectMenu'
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid'
import { Rule } from '@/types'

interface CoursePDFGeneratorProps {
  rules: Rule[]
  rulesLoading: boolean
  generateCoursePDF: (courseId: string) => Promise<string>
  isGenerating: boolean
}

const CoursePDFGenerator: FC<CoursePDFGeneratorProps> = ({
  rules,
  rulesLoading,
  generateCoursePDF,
  isGenerating,
}) => {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [isPdfReady, setIsPdfReady] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleGenerateCoursePDF = async () => {
    if (selectedCourse) {
      try {
        const url = await generateCoursePDF(selectedCourse)
        setPdfUrl(url)
        setIsPdfReady(true)
      } catch (error) {
        console.error('Failed to generate PDF:', error)
      }
    }
  }

  const handleDownloadPDF = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    }
  }

  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h3 className="text-base font-semibold leading-7 text-gray-900">Course PDF Generation</h3>
      <p className="mt-1 text-sm leading-6 text-gray-600">Generate a PDF for a specific course.</p>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
          {rulesLoading ? (
            <p>Loading courses...</p>
          ) : rules.length > 0 ? (
            <SelectMenu
              label="Select Course"
              value={selectedCourse}
              onChange={setSelectedCourse}
              options={rules.map((rule) => ({
                value: rule.id.toString(),
                label: `${rule.code} - ${rule.name}`,
              }))}
              placeholder="Choose a course"
            />
          ) : (
            <p>No courses available.</p>
          )}
        </div>
        <div className="sm:col-span-4">
          <button
            onClick={handleGenerateCoursePDF}
            disabled={isGenerating || !selectedCourse || rulesLoading}
            className="mt-2 flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            <DocumentTextIcon className="mr-2 h-5 w-5" />
            Generate Course PDF
          </button>
          {isPdfReady && (
            <button
              onClick={handleDownloadPDF}
              className="mt-2 flex w-full items-center justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
              Download PDF
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CoursePDFGenerator
