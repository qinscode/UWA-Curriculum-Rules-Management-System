'use client'

import React, { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import ManageRules from '@/components/ManageRules'
import { getCourseByCodeAndVersion } from '@/services/courseService'
import { CourseProvider } from '@/context/CourseContext'
import { getToken } from '@/services/authService'
import { Course } from '@/types'

export default function ManageRulesPage({
  searchParams,
}: {
  searchParams: { code?: string; version?: string }
}) {
  const { code, version } = searchParams

  const [courseData, setCourseData] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!code || !version) {
        redirect('/manage-course')
        return
      }

      try {
        const token = await getToken()
        console.log('token', token)

        const data = await getCourseByCodeAndVersion(
          code.toString(),
          version.toString(),
          token as string
        )
        setCourseData(data)
      } catch (error) {
        console.error('Error fetching course data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [code, version])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!courseData) {
    return <div>Error loading course data</div>
  }

  return (
    <CourseProvider initialCourse={courseData}>
      <ManageRules />
    </CourseProvider>
  )
}
