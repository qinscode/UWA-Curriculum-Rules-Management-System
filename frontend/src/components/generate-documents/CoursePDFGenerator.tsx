import React, { FC } from 'react'
import { DocumentTextIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid'
import { Course } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CoursePDFGeneratorProps {
  courses: Course[]
  isLoading: boolean
  selectedCourseId: string
  selectedVersion: string
  handleCourseChange: (value: string) => void
  handleVersionChange: (value: string) => void
  handleGenerateCoursePDF: () => void
  isPdfReady: boolean
  pdfUrl: string | null
  isGenerating: boolean
  versions: string[]
}

const CoursePDFGenerator: FC<CoursePDFGeneratorProps> = ({
  courses,
  isLoading,
  selectedCourseId,
  selectedVersion,
  handleCourseChange,
  handleVersionChange,
  handleGenerateCoursePDF,
  isPdfReady,
  pdfUrl,
  isGenerating,
  versions,
}) => {
  const handleDownloadPDF = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course PDF Generation</CardTitle>
        <CardDescription>Generate a PDF for a specific course version.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Select onValueChange={handleCourseChange} value={selectedCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading courses...
                  </SelectItem>
                ) : courses.length > 0 ? (
                  courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No courses available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select
              onValueChange={handleVersionChange}
              value={selectedVersion}
              disabled={!selectedCourseId || versions.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a version" />
              </SelectTrigger>
              <SelectContent>
                {versions.length > 0 ? (
                  versions.map((version) => (
                    <SelectItem key={version} value={version}>
                      {version}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No versions available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <Button
            onClick={handleGenerateCoursePDF}
            disabled={isGenerating || !selectedCourseId || !selectedVersion || isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500"
          >
            <DocumentTextIcon className="mr-2 h-5 w-5" />
            Generate Course PDF
          </Button>
          <Button
            onClick={handleGenerateCoursePDF}
            disabled={isGenerating || !selectedCourseId || !selectedVersion || isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500"
          >
            <DocumentTextIcon className="mr-2 h-5 w-5" />
            Generate Course HTML
          </Button>
          {isPdfReady && (
            <Button
              onClick={handleDownloadPDF}
              className="w-full bg-indigo-600 hover:bg-indigo-500"
            >
              <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
              Download PDF
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CoursePDFGenerator
