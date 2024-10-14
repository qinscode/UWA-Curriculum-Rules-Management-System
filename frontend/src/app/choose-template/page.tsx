'use client'
import React from 'react'

import CourseManage from '@/components/manage-course/ManageCourse'
import Layout from '@/components/Layout'
import withAuth from '@/components/auth/withAuth'
import TemplateManagementPage from "@/components/choose-template/ChooseTemplate";

function ChooseTemplatePage() {
  return (
    <Layout>
      <TemplateManagementPage />
    </Layout>
  )
}

// 使用 withAuth 包裹组件
export default withAuth(ChooseTemplatePage)
