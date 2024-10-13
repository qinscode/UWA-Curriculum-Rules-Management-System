import { Course, CreateCourseDto } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getCourses = async (token: string | null): Promise<Course[]> => {
  const response = await fetch(`${BASE_URL}/preset-courses`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch preset courses')
  }

  return await response.json()
}

export const createCourse = async (
  courseData: CreateCourseDto,
  token: string | null
): Promise<Course> => {
  const response = await fetch(`${BASE_URL}/preset-courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  })

  if (!response.ok) {
    throw new Error('Failed to create preset course')
  }

  return await response.json()
}

export const getCourseByCodeAndVersion = async (
  code: string,
  version: string,
  token: string | null
): Promise<Course> => {
  const response = await fetch(`${BASE_URL}/preset-courses/code/${code}/version/${version}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch preset course')
  }

  return await response.json()
}

export const deleteCourse = async (courseId: number, token: string | null): Promise<void> => {
  const response = await fetch(`${BASE_URL}/preset-courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete preset course')
  }
}
