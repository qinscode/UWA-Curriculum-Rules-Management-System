import { Rule, Settings, CreateRuleDTO, UpdateRuleDTO, UpdateSettingsDTO } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:6015/api';

async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const apiClient = {
  getRules: () => fetchJson<Rule[]>('/rules'),
  addRule: (rule: CreateRuleDTO) => fetchJson<Rule>('/rules', { method: 'POST', body: JSON.stringify(rule) }),
  updateRule: (id: number, rule: UpdateRuleDTO) => fetchJson<Rule>(`/rules/${id}`, { method: 'PUT', body: JSON.stringify(rule) }),
  deleteRule: (id: number) => fetchJson<void>(`/rules/${id}`, { method: 'DELETE' }),

  getSettings: () => fetchJson<Settings>('/settings'),
  updateSettings: (settings: UpdateSettingsDTO) => fetchJson<Settings>('/settings', { method: 'PUT', body: JSON.stringify(settings) }),
  
  exportRules: () => fetchJson<{ url: string }>('/rules/export'),
  generateHandbook: () => fetchJson<{ url: string }>('/handbook/generate'),
  generateCoursePDF: (courseId: string) => fetchJson<{ url: string }>(`/courses/${courseId}/generate-pdf`),

};