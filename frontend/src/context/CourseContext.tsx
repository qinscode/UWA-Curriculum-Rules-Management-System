import React, { createContext, useContext, useState } from 'react'
import { Course } from '@/types'

interface CourseContextType {
  course: Course | null
  updateCourse: (updater: (prevCourse: Course) => Course) => void
}

export const CourseContext = createContext<CourseContextType | null>(null)

export const CourseProvider: React.FC<{ initialCourse: Course; children: React.ReactNode }> = ({
  initialCourse,
  children,
}) => {
  const [course, setCourse] = useState<Course>(initialCourse)

  const updateCourse = (updater: (prevCourse: Course) => Course) => {
    setCourse((prevCourse) => {
      const updatedCourse = updater(prevCourse)
      // Here you would typically call an API to update the course data on the server
      console.log('Updated course:', updatedCourse)
      return updatedCourse
    })
  }

  return (
    <CourseContext.Provider value={{ course, updateCourse }}>{children}</CourseContext.Provider>
  )
}

export const useCourse = () => {
  const context = useContext(CourseContext)
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider')
  }
  return context
}
