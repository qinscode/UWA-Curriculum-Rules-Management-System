import { Course } from '../types'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getCourses = async (token: string | null): Promise<Course[]> => {
  const response = await fetch(`${BASE_URL}/courses`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Include Bearer token here
    },
  })

  if (!response.ok) {
    console.log('token', token)

    throw new Error('Failed to fetch courses')
  }

  const data: Course[] = await response.json()
  return data
}

export const getCourseById = async (token: string | null, id: number): Promise<Course[]> => {
  const response = await fetch(`${BASE_URL}/course/id`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Include Bearer token here
    },
  })

  if (!response.ok) {
    console.log('token', token)

    throw new Error('Failed to fetch courses')
  }

  const data: Course[] = await response.json()
  return data
}
