import { Course } from '@/types'

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

export const getCourseByCodeAndVersion = async (
  code: string,
  version: string,
  token: string | null
): Promise<Course> => {
  const response = await fetch(`${BASE_URL}/courses/code/${code}/version/${version}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`, // Include Bearer token here
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }

  return await response.json()
}
