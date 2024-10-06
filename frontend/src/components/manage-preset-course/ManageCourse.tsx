'use client'
import React, { useState, useEffect } from 'react'
import { getCourses } from '@/services/preset-courseService'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { Search, ArrowUpDown, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Course } from '@/types'
import { getToken } from '@/services/authService'

const courseTypes = [
  'Graduate Certificate',
  'Graduate Diploma',
  "Master's (Coursework)",
  "Master's Extended",
  "Master's Research",
  'Doctoral Degree',
  "Professional Doctorate/Master's Coursework",
]

const CourseManage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [newVersion, setNewVersion] = useState('')
  const [selectedCourseForNewVersion, setSelectedCourseForNewVersion] = useState<Course | null>(
    null
  )
  const [token, setToken] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    const storedToken = getToken()
    setToken(storedToken)
  }, [])

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) return
      try {
        const fetchedCourses = await getCourses(token)
        setCourses(fetchedCourses)
      } catch (error) {
        console.error('Error fetching courses:', error)
      }
    }

    fetchCourses()
  }, [token])

  const filteredAndSortedCourses = courses
    .filter(
      (course) =>
        (!selectedType || course.type === selectedType) &&
        (course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.type.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      } else {
        return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
      }
    })

  const handleEdit = (course: Course) => {
    router.push(`/manage-preset-rules?code=${course.code}&version=${course.version}`)
  }

  const handleVersionChange = (courseId: number, newVersion: string) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId ? { ...course, version: newVersion } : course
      )
    )
  }

  const handleAddVersion = (course: Course) => {
    setSelectedCourseForNewVersion(course)
    setNewVersion('')
  }

  const handleSaveNewVersion = () => {
    if (selectedCourseForNewVersion && newVersion) {
      setCourses(
        courses.map((course) =>
          course.id === selectedCourseForNewVersion.id
            ? {
                ...course,
                versions: [...course.versions, newVersion].sort((a, b) => b.localeCompare(a)),
                version: newVersion,
              }
            : course
        )
      )
      setSelectedCourseForNewVersion(null)
      setNewVersion('')
    }
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <h1 className="mb-6 text-3xl font-bold">Choose a Standard Rule</h1>
        <div className="mb-6 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px] pl-8"
            />
          </div>

          <Select value={selectedType ?? undefined} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Type" />
            </SelectTrigger>
            <SelectContent>
              {courseTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Card>
          <div className="rounded-lg border border-gray-200 shadow-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px] bg-blue-100">Course Code</TableHead>
                  {/*<TableHead className="bg-blue-100">Course Name</TableHead>*/}
                  <TableHead className="w-[200px] bg-blue-100">Type</TableHead>
                  <TableHead className="w-[180px] bg-blue-100">Version</TableHead>
                  {/*<TableHead className="w-[200px] bg-blue-100">*/}
                  {/*  <div className="flex items-center">*/}
                  {/*    Last updated*/}
                  {/*    <ArrowUpDown className="ml-2 h-4 w-4" />*/}
                  {/*  </div>*/}
                  {/*</TableHead>*/}
                  <TableHead className="w-[100px] bg-blue-100">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    {/*<TableCell>{course.name}</TableCell>*/}
                    <TableCell>{course.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={course.version}
                          onValueChange={(newVersion) => handleVersionChange(course.id, newVersion)}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {course.versions.map((version) => (
                              <SelectItem key={version} value={version}>
                                {version}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleAddVersion(course)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Add New Version</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <label htmlFor="new-version" className="text-right">
                                  New Version
                                </label>
                                <Input
                                  id="new-version"
                                  value={newVersion}
                                  onChange={(e) => setNewVersion(e.target.value)}
                                  className="col-span-3"
                                  placeholder="e.g., 2025"
                                />
                              </div>
                            </div>
                            <Button onClick={handleSaveNewVersion}>Save</Button>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                    {/*<TableCell>{course.lastUpdated}</TableCell>*/}
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className="transition-transform hover:bg-indigo-100 active:scale-95 active:bg-indigo-200"
                        onClick={() => handleEdit(course)}
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

export default CourseManage
