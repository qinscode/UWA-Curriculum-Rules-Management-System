import { Rule, Requirement } from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
if (!API_URL) {
  throw new Error('API base URL is not defined in environment variables.')
}

const getToken = (): string | null => {
  return localStorage.getItem('token')
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Request failed')
  }
  return response.json()
}

export const ruleService = {
  getAllRules: async (courseId: number): Promise<Rule[]> => {
    const res = await fetch(`${API_URL}/courses/${courseId}/rules`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(res)
  },

  getRequirement: async (courseId: number, ruleId: number): Promise<Requirement> => {
    const res = await fetch(`${API_URL}/courses/${courseId}/rules/${ruleId}/requirements`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(res)
  },

  getRules: async (courseId: number, ruleId: number): Promise<Rule> => {
    const res = await fetch(`${API_URL}/courses/${courseId}/rules/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(res)
  },

  createRule: async (courseId: number, ruleData: any): Promise<Rule> => {
    const res = await fetch(`${API_URL}/courses/${courseId}/rules/104/requirements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(ruleData),
    })
    return handleResponse(res)
  },

  updateRequirementByRuleId: async (
    courseId: number,
    ruleId: number,
    ruleData: any
  ): Promise<Rule> => {
    console.log(
      'Fetching data from:',
      `${API_URL}/courses/${courseId}/rules/${ruleId}/requirements`
    )
    console.log('Rule data:', ruleData)
    const res = await fetch(`${API_URL}/courses/${courseId}/rules/${ruleId}/requirements`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(ruleData),
    })

    return handleResponse(res)
  },

  deleteRule: async (courseId: number, ruleId: number): Promise<void> => {
    const res = await fetch(`${API_URL}/courses/${courseId}/rules/${ruleId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Delete failed')
    }
  },
}
