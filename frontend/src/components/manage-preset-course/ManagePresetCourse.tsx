'use client'
import React, { useState, useEffect } from 'react'
import { getCourses, createCourse, deleteCourse } from '@/services/preset-courseService'
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
import { Search, ArrowUpDown, Plus, AlertCircle, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Course, CreateCourseDto } from '@/types'
import { getToken } from '@/services/authService'
import { useUser } from '@/hooks/useUser'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'

const courseTypes = [
  'Graduate Certificate',
  'Graduate Diploma',
  "Master's (Coursework)",
  "Master's Extended",
  "Master's Research",
  'Doctoral Degree',
  "Professional Doctorate/Master's Coursework",
]

const PresetCourseManage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [newVersion, setNewVersion] = useState('')
  const [selectedCourseForNewVersion, setSelectedCourseForNewVersion] = useState<Course | null>(
    null
  )
  const [token, setToken] = useState<string | null>(null)
  const { user, loading: userLoading } = useUser()
  const [alertMessage, setAlertMessage] = useState<string | null>(null)
  const [isCreateCourseDialogOpen, setIsCreateCourseDialogOpen] = useState(false)
  const [newCourse, setNewCourse] = useState<CreateCourseDto>({
    code: '',
    name: '',
    type: '',
    version: '',
  })
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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

  const filteredAndSortedCourses = courses.filter(
    (course) =>
      (!selectedType || course.type === selectedType) &&
      (course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.type.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const showAlert = (message: string) => {
    setAlertMessage(message)
    setTimeout(() => setAlertMessage(null), 3000) // Hide alert after 3 seconds
  }

  const handleEdit = (course: Course) => {
    if (user?.role !== 'admin') {
      showAlert('Only administrators can edit standard rules.')
      return
    }
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
    if (user?.role !== 'admin') {
      showAlert('Only administrators can add new versions to standard rules.')
      return
    }
    setSelectedCourseForNewVersion(course)
    setNewVersion('')
  }

  const handleSaveNewVersion = () => {
    if (user?.role !== 'admin') {
      showAlert('Only administrators can save new versions of standard rules.')
      return
    }
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
      toast({
        title: 'New Version Added',
        description: `Successfully added new version ${newVersion} to course ${selectedCourseForNewVersion.code}`,
        duration: 3000,
      })
    }
  }

  const handleCreateCourse = async () => {
    if (user?.role !== 'admin') {
      showAlert('Only administrators can create standard rules.')
      return
    }

    // Check if a course with the same type already exists
    const existingCourse = courses.find((course) => course.type === newCourse.type)
    if (existingCourse) {
      toast({
        title: 'Creation Failed',
        description: `A course with type "${newCourse.type}" already exists. You cannot create duplicate course types.`,
        variant: 'destructive',
      })
      return
    }

    try {
      const createdCourse = await createCourse(newCourse, token)

      // Ensure the createdCourse has a versions array
      const courseWithVersions = {
        ...createdCourse,
        versions: createdCourse.versions || [createdCourse.version],
      }

      setCourses([...courses, courseWithVersions])
      setIsCreateCourseDialogOpen(false)
      setNewCourse({ code: '', name: '', type: '', version: '' })

      toast({
        title: 'Preset Course Created',
        description: `Successfully created standard rules: ${courseWithVersions.name}`,
        duration: 3000,
      })
    } catch (error) {
      console.error('Error creating standard rules:', error)
      toast({
        title: 'Error',
        description: 'Failed to create standard rules. Please try again.',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteCourse = (course: Course) => {
    if (user?.role !== 'admin') {
      showAlert('Only administrators can delete standard rules.')
      return
    }
    setCourseToDelete(course)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteCourse = async () => {
    if (courseToDelete && token) {
      try {
        await deleteCourse(courseToDelete.id, token)
        setCourses(courses.filter((course) => course.id !== courseToDelete.id))
        toast({
          title: 'Preset Course deleted',
          description: 'The standard rules has been successfully deleted.',
        })
      } catch (error) {
        console.error('Error deleting standard rules:', error)
        toast({
          title: 'Error',
          description: 'Failed to delete the standard rules. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setCourseToDelete(null)
        setIsDeleteDialogOpen(false)
      }
    }
  }

  const handleOpenCreateCourseDialog = () => {
    if (user?.role !== 'admin') {
      showAlert('Only administrators can create new standard rules.')
      return
    }
    setIsCreateCourseDialogOpen(true)
  }

  if (userLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <h1 className="mb-6 text-3xl font-bold">Manage Standard Rules</h1>

        {alertMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Permission Denied</AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <div className="mb-6 flex items-center justify-between">
          {user?.role === 'admin' ? (
            <Dialog open={isCreateCourseDialogOpen} onOpenChange={setIsCreateCourseDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-indigo-600 text-white hover:bg-indigo-500"
                  onClick={handleOpenCreateCourseDialog}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Preset Course
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Preset Course</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="code">Course Code</label>
                    <Input
                      id="code"
                      value={newCourse.code}
                      onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name">Course Name</label>
                    <Input
                      id="name"
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="type">Course Type</label>
                    <Select
                      value={newCourse.type}
                      onValueChange={(value) => setNewCourse({ ...newCourse, type: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select course type" />
                      </SelectTrigger>
                      <SelectContent>
                        {courseTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="version">Version</label>
                    <Input
                      id="version"
                      value={newCourse.version}
                      onChange={(e) => setNewCourse({ ...newCourse, version: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <Button onClick={handleCreateCourse}>Create Preset Course</Button>
              </DialogContent>
            </Dialog>
          ) : (
            <Button
              className="bg-indigo-600 text-white hover:bg-indigo-500"
              onClick={() => showAlert('Only administrators can create new standard rule.')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New Preset Course
            </Button>
          )}

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
                            {(course.versions || [course.version]).map((version) => (
                              <SelectItem key={version} value={version}>
                                {version}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {user?.role === 'admin' ? (
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
                        ) : (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              showAlert(
                                'Only administrators can add new versions to standard rules.'
                              )
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    {/*<TableCell>{course.lastUpdated}</TableCell>*/}
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="transition-transform hover:bg-indigo-100 active:scale-95 active:bg-indigo-200"
                          onClick={() => handleEdit(course)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="transition-transform hover:bg-red-100 active:scale-95 active:bg-red-200"
                          onClick={() => handleDeleteCourse(course)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the standard rules "{courseToDelete?.name}" (
                {courseToDelete?.code})? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteCourse}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default PresetCourseManage
