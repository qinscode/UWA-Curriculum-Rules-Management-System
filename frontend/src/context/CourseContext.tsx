import { createContext, useContext } from 'react'
import { Course } from '@/types'
export const CourseContext = createContext<Course | null>(null)

export const useCourse = () => useContext(CourseContext)
