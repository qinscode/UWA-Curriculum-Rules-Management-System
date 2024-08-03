import { Rule, Settings, CreateRuleDTO, UpdateRuleDTO, UpdateSettingsDTO } from '../types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cab.fudong.dev/api'

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  // 使用 URL 对象来正确处理路径
  const fullUrl = new URL(url, API_BASE_URL).toString();
  console.log('Requesting URL:', fullUrl); // 添加日志

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    console.error('API Error:', response.status, response.statusText); // 添加错误日志
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const apiClient = {
  getRules: () => fetchJson<Rule[]>('/rules'),
  addRule: (rule: CreateRuleDTO) =>
    fetchJson<Rule>('/rules', { method: 'POST', body: JSON.stringify(rule) }),
  updateRule: (id: number, rule: UpdateRuleDTO) =>
    fetchJson<Rule>(`/rules/${id}`, { method: 'PUT', body: JSON.stringify(rule) }),
  deleteRule: (id: number) => fetchJson<void>(`/rules/${id}`, { method: 'DELETE' }),

  getSettings: () => fetchJson<Settings>('/settings'),
  updateSettings: (settings: UpdateSettingsDTO) =>
    fetchJson<Settings>('/settings', { method: 'PUT', body: JSON.stringify(settings) }),

  exportRules: () => fetchJson<{ url: string }>('/rules/export'),
  generateHandbook: () => fetchJson<{ url: string }>('/handbook/generate'),
  generateCoursePDF: (courseId: string) =>
    fetchJson<{ url: string }>(`/courses/${courseId}/generate-pdf`),
}