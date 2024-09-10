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
  getAllRules: async (): Promise<Rule[]> => {
    const res = await fetch(`${API_URL}/preset-rules`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(res)
  },

  getRequirement: async (ruleId: number): Promise<Requirement> => {
    const res = await fetch(`${API_URL}/preset-rules/${ruleId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
    return handleResponse(res)
  },
}
