import { Course, CourseType } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export const getStandardRuleType = async (token: string | null): Promise<CourseType[]> => {
  const response = await fetch(`${BASE_URL}/preset-rules/course-types`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    console.log('token', token)
    throw new Error('Failed to fetch course types')
  }

  const data = await response.json()
  return data.map((type: string) => type as CourseType)
}

export const getStandardRuleByType = async (
  type: string,
  token: string | null
): Promise<Course> => {
  const response = await fetch(`${BASE_URL}/preset-rules/by-course-type/${type}`, {
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
