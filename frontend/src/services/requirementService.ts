import { Requirement } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
if (!API_URL) {
  throw new Error('API base URL is not defined in environment variables.')
}

const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Request failed')
  }
  return response.json()
}

const fetchWithAuth = (url: string, options: RequestInit = {}) => {
  const token = getToken()
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
}

export const requirementService = {
  getAllRequirements: async (courseId: number, ruleId: number): Promise<Requirement[]> => {
    const res = await fetchWithAuth(`${API_URL}/courses/${courseId}/rules/${ruleId}/requirements`)
    return handleResponse(res)
  },

  getRequirement: async (
    courseId: number,
    ruleId: number,
    requirementId: number
  ): Promise<Requirement> => {
    const res = await fetchWithAuth(
      `${API_URL}/courses/${courseId}/rules/${ruleId}/requirements/${requirementId}`
    )
    return handleResponse(res)
  },

  createRequirement: async (
    courseId: number,
    ruleId: number,
    requirementData: Partial<Requirement>
  ): Promise<Requirement> => {
    const res = await fetchWithAuth(`${API_URL}/courses/${courseId}/rules/${ruleId}/requirements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requirementData),
    })
    return handleResponse(res)
  },

  updateRequirement: async (
    courseId: number,
    ruleId: number,
    requirementId: number,
    requirementData: Partial<Requirement>
  ): Promise<Requirement> => {
    const res = await fetchWithAuth(
      `${API_URL}/courses/${courseId}/rules/${ruleId}/requirements/${requirementId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requirementData),
      }
    )
    return handleResponse(res)
  },

  deleteRequirement: async (
    courseId: number,
    ruleId: number,
    requirementId: number
  ): Promise<void> => {
    const res = await fetchWithAuth(
      `${API_URL}/courses/${courseId}/rules/${ruleId}/requirements/${requirementId}`,
      {
        method: 'DELETE',
      }
    )
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Delete failed')
    }
  },

  addChildRequirement: async (
    courseId: number,
    ruleId: number,
    parentRequirementId: number,
    childRequirementData: Partial<Requirement>
  ): Promise<Requirement> => {
    const res = await fetchWithAuth(
      `${API_URL}/courses/${courseId}/rules/${ruleId}/requirements/${parentRequirementId}/children`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(childRequirementData),
      }
    )
    return handleResponse(res)
  },

  getChildRequirements: async (
    courseId: number,
    ruleId: number,
    parentRequirementId: number
  ): Promise<Requirement[]> => {
    const res = await fetchWithAuth(
      `${API_URL}/courses/${courseId}/rules/${ruleId}/requirements/${parentRequirementId}/children`
    )
    return handleResponse(res)
  },

  updateRequirements: async (
    courseId: number,
    ruleId: number,
    requirementsData: Partial<Requirement>[]
  ): Promise<Requirement[]> => {
    const res = await fetchWithAuth(`${API_URL}/courses/${courseId}/rules/${ruleId}/requirements`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requirementsData),
    })
    return handleResponse(res)
  },
}
