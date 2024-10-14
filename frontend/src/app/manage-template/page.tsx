'use client'

import React, { Suspense, lazy, useState, useEffect } from 'react'
import { redirect } from 'next/navigation'
import {getCourseByCodeAndVersion, getCourseById} from '@/services/courseService'
import { CourseProvider } from '@/context/CourseContext'
import { getToken } from '@/services/authService'
import { Course } from '@/types'
import withAuth from '@/components/auth/withAuth'

const ManageTemplate = lazy(() => import('@/components/template-management/ManageTemplate'))

function ManageTemplatePage({ searchParams }: { searchParams: { id?: string } }) {
  const { id } = searchParams

  const [courseData, setCourseData] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        redirect('/choose-template')
        return
      }

      try {
        const token = await getToken()
        console.log('token', token)

        const data = await getCourseById(id.toString(), token as string) // Fetch course by id
        setCourseData(data)
      } catch (error) {
        console.error('Error fetching course data by id:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!courseData) {
    return <div>Error loading course data</div>
  }

  return (
    <CourseProvider initialCourse={courseData}>
      <Suspense fallback={<div>Loading...</div>}>
        <ManageTemplate />
      </Suspense>
    </CourseProvider>
  )
}

export default withAuth(ManageTemplatePage)
