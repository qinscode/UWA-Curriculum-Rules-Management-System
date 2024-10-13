'use client'
import React from 'react'

import PresetCourseManage from '@/components/manage-preset-course/ManagePresetCourse'
import Layout from '@/components/Layout'
import withAuth from '@/components/auth/withAuth'

function CourseManagePage() {
  return (
    <Layout>
      <PresetCourseManage />
    </Layout>
  )
}

export default withAuth(CourseManagePage)
