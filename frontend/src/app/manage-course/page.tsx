import React from 'react'
import CourseManage from '@/components/manage-course/ManageCourse'
import Layout from '@/components/Layout'

export const metadata = {
  title: 'Course Management',
}

export default function CourseManagePage() {
  return (
    <Layout>
      <CourseManage />
    </Layout>
  )
}
