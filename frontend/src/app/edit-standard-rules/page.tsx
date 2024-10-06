'use client'

import React, { Suspense, lazy, useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import { CourseProvider } from '@/context/CourseContext'
import { getToken } from '@/services/authService'
import { Course } from '@/types'
import withAuth from '@/components/auth/withAuth'
import { getStandardRuleByType } from '@/services/standardRuleService'

const ManageStandardRules = lazy(() => import('@/components/manage-rules/ManageStandardRules'))

function ManageStandardRulesPage({ searchParams }: { searchParams: { type?: string } }) {
  const { type } = searchParams

  const [courseData, setCourseData] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!type) {
        redirect('/manage-standard-rules')
        return
      }

      try {
        const token = await getToken()
        console.log('token', token)

        const data = await getStandardRuleByType(type, token as string)
        setCourseData(data)
        console.log('manage-standard-rules', data)
      } catch (error) {
        console.error('Error fetching course data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [type])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!courseData) {
    return <div>Error loading course data</div>
  }

  return (
    <CourseProvider initialCourse={courseData}>
      <Suspense fallback={<div>Loading...</div>}>
        <ManageStandardRules />
      </Suspense>
    </CourseProvider>
  )
}

export default withAuth(ManageStandardRulesPage)
