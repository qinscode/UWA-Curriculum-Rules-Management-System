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

export const presetRuleService = {
  getAllRules: async (courseId: number): Promise<Rule[]> => {
    // const res = await fetch(`${API_URL}/preset-courses/${courseId}/preset-rules`, {

    const res = await fetch(`${API_URL}/preset-courses/${courseId}/preset-rules`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    console.log('PRESET !!! Response:', res)
    return handleResponse(res)
  },

  getRequirement: async (courseId: number, ruleId: number): Promise<Requirement> => {
    const res = await fetch(
      `${API_URL}/preset-courses/${courseId}/preset-rules/${ruleId}/preset-requirements`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    )
    return handleResponse(res)
  },

  getRules: async (courseId: number, ruleId: number): Promise<Rule> => {
    const res = await fetch(`${API_URL}/preset-courses/${courseId}/preset-rules/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(res)
  },

  createRule: async (courseId: number, ruleData: any): Promise<Rule> => {
    const res = await fetch(`${API_URL}/preset-courses/${courseId}/rules/104/preset-requirements`, {
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
    requirements: Requirement[]
  ) => {
    console.log(`Updating rule ${ruleId} for course ${courseId}:`, requirements)
    try {
      const res = await fetch(
        `${API_URL}/preset-courses/${courseId}/preset-rules/${ruleId}/preset-requirements`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(requirements), // 直接发送 requirements 数组
        }
      )
      const data = await handleResponse(res)
      console.log(`Update response for rule ${ruleId}:`, data)
      return data
    } catch (error) {
      console.error(`Error updating rule ${ruleId}:`, error)
      throw error
    }
  },

  deleteRule: async (courseId: number, ruleId: number): Promise<void> => {
    const res = await fetch(`${API_URL}/preset-courses/${courseId}/preset-rules/${ruleId}`, {
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
