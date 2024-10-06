'use client'

import Layout from '@/components/Layout'
import withAuth from '@/components/auth/withAuth'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { getToken } from '@/services/authService'
import { getStandardRuleType } from '@/services/standardRuleService'
import { CourseType } from '@/types'

const CourseManage: React.FC = () => {
  const [courseTypes, setCourseTypes] = useState<string[]>([])
  const [token, setToken] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const storedToken = getToken()
    setToken(storedToken)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return
      try {
        const fetchedCourseTypes = await getStandardRuleType(token)
        // @ts-ignore
        setCourseTypes(fetchedCourseTypes)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [token])

  const handleEdit = (courseType: string) => {
    router.push(`/edit-standard-rules?type=${courseType.toString()}`)
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <h1 className="mb-6 text-3xl font-bold">Choose a Course Type</h1>
        <Card>
          <div className="rounded-lg border border-gray-200 shadow-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] bg-blue-100">Course Type</TableHead>
                  <TableHead className="w-[100px] bg-blue-100">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courseTypes.map((courseType) => (
                  <TableRow key={courseType}>
                    <TableCell>
                      {courseType} {CourseType[courseType]}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="transition-transform hover:bg-indigo-100 active:scale-95 active:bg-indigo-200"
                        onClick={() => handleEdit(courseType)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  )
}

function CourseManagePage() {
  return (
    <Layout>
      <CourseManage />
    </Layout>
  )
}

export default withAuth(CourseManagePage)
