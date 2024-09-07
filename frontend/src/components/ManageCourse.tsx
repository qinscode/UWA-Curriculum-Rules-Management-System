'use client'

import React, { useState, useEffect } from 'react'
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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, ArrowUpDown, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Course {
  id: string
  code: string
  name: string
  type: string
  versions: string[]
  version: string
  category: string
  lastUpdated: string
}

const categories = ['Postgraduate', 'Undergraduate', 'Higher Degree']

const CourseManage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [newVersion, setNewVersion] = useState('')
  const [selectedCourseForNewVersion, setSelectedCourseForNewVersion] = useState<Course | null>(
    null
  )
  const router = useRouter()

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockCourses: Course[] = [
      {
        id: '1',
        code: 'MIT',
        name: 'Master of Information Technology',
        type: 'Postgraduate(Coursework)',
        versions: ['2024', '2023', '2022'],
        version: '2024',
        category: 'Postgraduate',
        lastUpdated: '2024-03-08 14:30',
      },
      {
        id: '2',
        code: 'MRES',
        name: 'Master of Research in Computer Science',
        type: 'Postgraduate(Research)',
        versions: ['2024', '2023'],
        version: '2024',
        category: 'Postgraduate',
        lastUpdated: '2024-03-07 10:15',
      },
      {
        id: '3',
        code: 'BCOM',
        name: 'Bachelor of Commerce',
        type: 'Undergraduate',
        versions: ['2024', '2023', '2022'],
        version: '2024',
        category: 'Undergraduate',
        lastUpdated: '2024-03-06 09:45',
      },
      {
        id: '4',
        code: 'PHD',
        name: 'Doctor of Philosophy in Data Science',
        type: 'PhD',
        versions: ['2024'],
        version: '2024',
        category: 'Higher Degree',
        lastUpdated: '2024-03-05 16:20',
      },
      {
        id: '5',
        code: 'DBUS',
        name: 'Doctor of Business Administration',
        type: 'Doctorates',
        versions: ['2024', '2023', '2022'],
        version: '2024',
        category: 'Higher Degree',
        lastUpdated: '2024-03-04 11:00',
      },
      {
        id: '6',
        code: 'MCOM',
        name: 'Master of Commerce and Master of Business Analytics',
        type: 'Postgraduate combined courses',
        versions: ['2024', '2023', '2022'],
        version: '2024',
        category: 'Higher Degree',
        lastUpdated: '2024-03-03 13:50',
      },
    ]
    setCourses(mockCourses)
  }, [])

  const filteredAndSortedCourses = courses
    .filter(
      (course) =>
        (!selectedCategory || course.category === selectedCategory) &&
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

  const handleEdit = (courseId: string, version: string) => {
    router.push(`/manage-rules?code=${courseId}&version=${version}`)
  }

  const handleVersionChange = (courseId: string, newVersion: string) => {
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
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r bg-gray-100/40">
        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Categories</h2>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'secondary' : 'ghost'}
                className="w-full justify-start"
                onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
              >
                {category}
              </Button>
            ))}
          </ScrollArea>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <h1 className="mb-6 text-3xl font-bold">Choose template</h1>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead className="w-[200px]">Type</TableHead>
                  <TableHead className="w-[180px]">Version</TableHead>
                  <TableHead className="w-[200px]">
                    <div className="flex items-center">
                      Last updated
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.code}</TableCell>
                    <TableCell>{course.name}</TableCell>
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
                    <TableCell>{course.lastUpdated}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(course.id, course.version)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CourseManage
