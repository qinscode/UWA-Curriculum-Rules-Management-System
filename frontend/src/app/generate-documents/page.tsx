'use client'
import React, { useState, useEffect, FC } from 'react'
import Layout from '@/components/Layout'
import { useDocuments } from '@/hooks/useDocuments'
import Footer from '@/components/Footer'
import HandbookGenerator from '@/components/generate-documents/HandbookGenerator'
import RulesExporter from '@/components/generate-documents/RulesExporter'
import LoadingOverlay from '@/components/generate-documents/LoadingOverlay'
import CoursePDFGenerator from '@/components/generate-documents/CoursePDFGenerator'
import { getCourses } from '@/services/courseService'
import { getToken } from '@/services/authService'
import { Course } from '@/types'
import { config } from 'dotenv'

config()

const GenerateDocuments: FC = () => {
  const { isGenerating, error: docError, generateCoursePDF, exportRules } = useDocuments()
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  const [isPdfReady, setIsPdfReady] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = getToken()
    setToken(storedToken)
  }, [])

  useEffect(() => {
    console.log('selectedCourseId', selectedCourseId)
  }, [selectedCourseId])

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) return
      setIsLoading(true)
      try {
        const fetchedCourses = await getCourses(token)
        setCourses(Array.isArray(fetchedCourses) ? fetchedCourses : [])
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching courses:', error)
        setError('Failed to fetch courses')
        setCourses([])
        setIsLoading(false)
      }
    }

    fetchCourses()
  }, [token])

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value)
    setSelectedVersion('') // Reset version when course changes
  }

  const handleVersionChange = (value: string) => {
    setSelectedVersion(value)
  }

  const handleGenerateCoursePDF = async () => {
    if (selectedCourseId && selectedVersion) {
      try {
        const url = await generateCoursePDF(selectedCourseId)
        console.log('Generated PDF:', process.env.NEXT_PUBLIC_PDF_URL_PREFIX + url)
        setPdfUrl(process.env.NEXT_PUBLIC_PDF_URL_PREFIX + url)
        setIsPdfReady(true)
      } catch (error) {
        console.error('Failed to generate PDF:', error)
      }
    }
  }

  const selectedCourse = courses.find((course) => course.id.toString() === selectedCourseId)
  const code = courses.find((course) => course.id.toString() === selectedCourseId)?.code
  const versions = selectedCourse?.versions || []

  // @ts-ignore
  return (
    <Layout>
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Generate Documentation</h2>
      {docError && <div className="mb-4 text-red-500">{docError}</div>}
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <div className="space-y-8">
        <CoursePDFGenerator
          courses={courses}
          isLoading={isLoading}
          selectedCourseId={selectedCourseId}
          selectedVersion={selectedVersion}
          handleCourseChange={handleCourseChange}
          handleVersionChange={handleVersionChange}
          handleGenerateCoursePDF={handleGenerateCoursePDF}
          isPdfReady={isPdfReady}
          pdfUrl={pdfUrl}
          isGenerating={isGenerating}
          versions={versions}
        />
        <HandbookGenerator course={code} />
        <RulesExporter exportRules={exportRules} isGenerating={isGenerating} />
      </div>
      {isGenerating && <LoadingOverlay />}
      <Footer />
    </Layout>
  )
}

export default GenerateDocuments
