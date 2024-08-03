import { Rule, Settings, CreateRuleDTO, UpdateRuleDTO, UpdateSettingsDTO } from '../types'
import urljoin from 'url-join'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cab.fudong.dev/api/'

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const fullUrl = urljoin(API_BASE_URL, url)
  console.log('API_BASE_URL', API_BASE_URL)
  console.log('url', url)
  console.log('Requesting URL:', fullUrl)

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
  getRules: () => fetchJson<Rule[]>('rules'),
  addRule: (rule: CreateRuleDTO) =>
    fetchJson<Rule>('rules', { method: 'POST', body: JSON.stringify(rule) }),
  updateRule: (id: number, rule: UpdateRuleDTO) =>
    fetchJson<Rule>(`rules/${id}`, { method: 'PUT', body: JSON.stringify(rule) }),
  deleteRule: (id: number) => fetchJson<void>(`rules/${id}`, { method: 'DELETE' }),

  getSettings: () => fetchJson<Settings>('settings'),
  updateSettings: (settings: UpdateSettingsDTO) =>
    fetchJson<Settings>('settings', { method: 'PUT', body: JSON.stringify(settings) }),

  exportRules: () => fetchJson<{ url: string }>('rules/export'),
  generateHandbook: () => fetchJson<{ url: string }>('handbook/generate'),
  generateCoursePDF: (courseId: string) =>
    fetchJson<{ url: string }>(`courses/${courseId}/generate-pdf`),
}
