'use client'
import React from 'react'

import CourseManage from '@/components/manage-course/ManageCourse'
import Layout from '@/components/Layout'
import withAuth from '@/components/auth/withAuth'

function CourseManagePage() {
  return (
    <Layout>
      <CourseManage />
    </Layout>
  )
}

export default withAuth(CourseManagePage)
