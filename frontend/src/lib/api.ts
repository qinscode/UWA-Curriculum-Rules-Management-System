// lib/api.ts

// Mock data
const mockRules = [
  { id: 1, courseId: 101, ruleText: 'Students must complete all prerequisites before enrolling.' },
  { id: 2, courseId: 102, ruleText: 'Attendance is mandatory for all lab sessions.' },
  { id: 3, courseId: 103, ruleText: 'Final project contributes 40% to the overall grade.' },
]

const mockCourses = [
  { id: 101, code: 'CS101', name: 'Introduction to Programming' },
  { id: 102, code: 'MATH201', name: 'Advanced Calculus' },
  { id: 103, code: 'PHYS301', name: 'Quantum Mechanics' },
]

const mockSettings = {
  universityName: 'Example University',
  academicYear: '2023-2024',
  pdfTemplate: 'template1',
  handbookFormat: 'pdf',
  defaultUserRole: 'viewer',
  autoSave: true,
  emailNotifications: false,
}

// API functions

// Rules
export async function fetchRules(): Promise<typeof mockRules> {
  // Simulating API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockRules
}

export async function createRule(
  rule: Omit<(typeof mockRules)[0], 'id'>
): Promise<(typeof mockRules)[0]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const newRule = { ...rule, id: Math.max(...mockRules.map((r) => r.id)) + 1 }
  mockRules.push(newRule)
  return newRule
}

export async function updateRule(
  id: number,
  rule: Partial<(typeof mockRules)[0]>
): Promise<(typeof mockRules)[0]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockRules.findIndex((r) => r.id === id)
  if (index === -1) throw new Error('Rule not found')
  mockRules[index] = { ...mockRules[index], ...rule }
  return mockRules[index]
}

export async function deleteRule(id: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const index = mockRules.findIndex((r) => r.id === id)
  if (index === -1) throw new Error('Rule not found')
  mockRules.splice(index, 1)
}

// Courses
export async function fetchCourses(): Promise<typeof mockCourses> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockCourses
}

// Documents
export async function generateCoursePDF(courseId: number): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return `http://example.com/course_${courseId}_rules.pdf`
}

export async function generateHandbookPDF(): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return 'http://example.com/complete_handbook.pdf'
}

export async function exportRulesJSON(): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return 'http://example.com/rules_export.json'
}

// Settings
export async function fetchSettings(): Promise<typeof mockSettings> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockSettings
}

export async function updateSettings(
  newSettings: Partial<typeof mockSettings>
): Promise<typeof mockSettings> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  Object.assign(mockSettings, newSettings)
  return mockSettings
}
