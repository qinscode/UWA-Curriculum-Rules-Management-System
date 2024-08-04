'use client'
import React, { useState } from 'react'
import Layout from '@/components/Layout'
import SelectMenu from '@/components/SelectMenu'
import { useDocuments } from '@/hooks/useDocuments'
import {
  PhotoIcon,
  DocumentTextIcon,
  ArrowDownTrayIcon,
  BookOpenIcon,
} from '@heroicons/react/24/solid'
import { useRules } from '@/hooks/useRules'

export default function GenerateDocuments(): JSX.Element {
  const {
    isGenerating,
    error: docError,
    generateCoursePDF,
    generateHandbook,
    exportRules,
  } = useDocuments()
  const { rules, isLoading: rulesLoading, error: rulesError } = useRules()
  const [selectedCourse, setSelectedCourse] = useState('')

  const handleGenerateCoursePDF = () => {
    if (selectedCourse) {
      generateCoursePDF(selectedCourse)
    }
  }

  return (
    <Layout>
      <h2 className="mb-8 text-2xl font-bold text-gray-900">Generate Documentation</h2>
      {docError && <div className="mb-4 text-red-500">{docError}</div>}
      {rulesError && <div className="mb-4 text-red-500">{rulesError}</div>}
      <div className="mb-8 space-y-4 bg-white p-6 shadow sm:rounded-lg">
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Course PDF Generation
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Generate a PDF for a specific course.
            </p>
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
              </div>
            </div>
          </div>

          <div className="border-b border-gray-900/10 pb-12">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Full Handbook Generation
            </h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Generate a complete handbook containing all course information.
            </p>
            <div className="mt-6">
              <button
                onClick={generateHandbook}
                disabled={isGenerating}
                className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:w-auto"
              >
                <BookOpenIcon className="mr-2 h-5 w-5" />
                Generate Full Handbook PDF
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold leading-7 text-gray-900">Export Rules</h3>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Export all rules as a JSON file for backup or integration purposes.
            </p>
            <div className="mt-6">
              <button
                onClick={exportRules}
                disabled={isGenerating}
                className="flex w-full items-center justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 sm:w-auto"
              >
                <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
                Export Rules as JSON
              </button>
            </div>
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
          <div className="rounded-lg bg-white p-6 shadow-xl">
            <p className="text-lg font-semibold">Generating document...</p>
            {/* You could add a loading spinner here */}
          </div>
        </div>
      )}
    </Layout>
  )
}
