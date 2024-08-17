'use client'
import React, { useState, FC } from 'react'
import Layout from '@/components/Layout'
import { useDocuments } from '@/hooks/useDocuments'
import { useRules } from '@/hooks/useRules'
import Footer from '@/components/Footer'
import HandbookGenerator from '@/components/generate-documents/HandbookGenerator'
import RulesExporter from '@/components/generate-documents/RulesExporter'
import LoadingOverlay from '@/components/generate-documents/LoadingOverlay'
import CoursePDFGenerator from '@/components/generate-documents/CoursePDFGenerator'

const GenerateDocuments: FC = () => {
  const {
    isGenerating,
    error: docError,
    generateCoursePDF,
    generateHandbook,
    exportRules,
  } = useDocuments()
  const { rules, isLoading: rulesLoading, error: rulesError } = useRules()
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [isPdfReady, setIsPdfReady] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)

  const handleCourseChange = (value: string | string[]) => {
    setSelectedCourse(Array.isArray(value) ? value[0] : value)
  }

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

  return (
    <>
      <Layout>
        <h2 className="mb-8 text-2xl font-bold text-gray-900">Generate Documentation</h2>
        {docError && <div className="mb-4 text-red-500">{docError}</div>}
        {rulesError && <div className="mb-4 text-red-500">{rulesError}</div>}
        <div className="-mx-6 mb-8 space-y-4 bg-white p-6 shadow sm:-mx-6 sm:rounded-lg lg:-mx-8">
          <div className="space-y-12">
            <CoursePDFGenerator
              rules={rules}
              rulesLoading={rulesLoading}
              selectedCourse={selectedCourse}
              handleCourseChange={handleCourseChange}
              handleGenerateCoursePDF={handleGenerateCoursePDF}
              isPdfReady={isPdfReady}
              pdfUrl={pdfUrl}
              isGenerating={isGenerating}
            />
            <HandbookGenerator generateHandbook={generateHandbook} isGenerating={isGenerating} />
            <RulesExporter exportRules={exportRules} isGenerating={isGenerating} />
          </div>
        </div>
        {isGenerating && <LoadingOverlay />}
      </Layout>
      <Footer />
    </>
  )
}

export default GenerateDocuments
