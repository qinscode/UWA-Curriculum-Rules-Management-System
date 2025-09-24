import { Rule, CreateRuleDTO, UpdateRuleDTO } from '@/types'
import urljoin from 'url-join'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cab.fudong.dev/api/'

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const fullUrl = urljoin(API_BASE_URL, url)

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    console.error('API Error:', response.status, response.statusText)
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const data = await response.json()
  console.log('Response Data:', data)
  return data
}

export const apiClient = {
  getRules: async (page: number, limit: number, search: string = '') => {
    try {
      const data = await fetchJson<{ rules: Rule[]; total: number }>(
        `rules?page=${page}&limit=${limit}&search=${search}`
      )
      return { rules: data.rules || [], total: data.total || 0 }
    } catch (error) {
      console.error('Error fetching rules:', error)
      return { rules: [], total: 0 }
    }
  },
  addRule: (rule: CreateRuleDTO) =>
    fetchJson<Rule>('rules', { method: 'POST', body: JSON.stringify(rule) }),
  updateRule: (id: number, rule: UpdateRuleDTO) =>
    fetchJson<Rule>(`rules/${id}`, { method: 'PUT', body: JSON.stringify(rule) }),
  deleteRule: (id: number) => fetchJson<void>(`rules/${id}`, { method: 'DELETE' }),
  restoreRuleVersion: (id: number, version: number) =>
    fetchJson<Rule>(`rules/${id}/restore/${version}`, { method: 'PUT' }),

  exportRules: () => fetchJson<{ url: string }>('rules/export'),
  generateHandbook: () => fetchJson<{ url: string }>('handbook/generate'),
  generateCoursePDF: (courseId: string) =>
    fetchJson<{ url: string }>(`/documents/course/${courseId}/pdf`, { method: 'GET' }),
  generateCourseHTML: (courseId: string) =>
    fetchJson<{ url: string }>(`/documents/course/${courseId}/html`, { method: 'GET' }),
}
