import { RuleType, Rule, CreateRuleDTO, UpdateRuleDTO, Requirement } from '@/types'

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

  getRule: async (courseId: number, ruleId: number): Promise<Rule> => {
    const res = await fetch(`${API_URL}/courses/${courseId}/rules/${ruleId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(res)
  },

  createRule: async (
    courseId: number,
    ruleData: {
      requirements: Requirement[]
      name: RuleType
      description: `${RuleType} rule`
      type: RuleType
    }
  ): Promise<Rule> => {
    const res = await fetch(`${API_URL}/courses/${courseId}/rules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(ruleData),
    })
    return handleResponse(res)
  },

  updateRule: async (courseId: number, ruleId: number, ruleData: UpdateRuleDTO): Promise<Rule> => {
    const res = await fetch(`${API_URL}/courses/${courseId}/rules/${ruleId}`, {
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
