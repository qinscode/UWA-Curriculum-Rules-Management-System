import { Course, CreateCourseDto } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getCourses = async (token: string | null): Promise<Course[]> => {
  const response = await fetch(`${BASE_URL}/courses`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    console.log('token', token)

    throw new Error('Failed to fetch courses')
  }

  return await response.json()
}

export const createCourse = async (
  courseData: CreateCourseDto,
  token: string | null
): Promise<Course> => {
  const response = await fetch(`${BASE_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  })

  if (!response.ok) {
    throw new Error('Failed to create course')
  }

  return await response.json()
}

export const getCourseByCodeAndVersion = async (
  code: string,
  version: string,
  token: string | null
): Promise<Course> => {
  const response = await fetch(`${BASE_URL}/courses/code/${code}/version/${version}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }

  return await response.json()
}

export const deleteCourse = async (courseId: number, token: string | null): Promise<void> => {
  const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete course')
  }
}
