// lib/api-client.ts

import { Settings } from '../types/settings';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 假数据
const mockRules = [
  { id: 1, code: 'CS101', name: 'Introduction to Programming', type: 'Standard', description: 'Basic programming concepts' },
  { id: 2, code: 'MATH201', name: 'Advanced Calculus', type: 'Custom', description: 'Higher-level mathematics' },
  { id: 3, code: 'ENG102', name: 'Academic Writing', type: 'Standard', description: 'Essay writing and research skills' },
];

const mockSettings: Settings = {
  universityName: 'Example University',
  academicYear: '2023-2024',
  pdfTemplate: 'template1',
  handbookFormat: 'pdf',
  defaultUserRole: 'editor',
};

// 模拟 API 客户端
export const apiClient = {
  // 规则相关
  getRules: async () => {
    await delay(500); // 模拟网络延迟
    return [...mockRules];
  },

  addRule: async (rule: Omit<typeof mockRules[0], 'id'>) => {
    await delay(500);
    const newRule = { ...rule, id: Math.max(...mockRules.map(r => r.id)) + 1 };
    mockRules.push(newRule);
    return newRule;
  },

  updateRule: async (id: number, rule: Partial<typeof mockRules[0]>) => {
    await delay(500);
    const index = mockRules.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Rule not found');
    mockRules[index] = { ...mockRules[index], ...rule };
    return mockRules[index];
  },

  deleteRule: async (id: number) => {
    await delay(500);
    const index = mockRules.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Rule not found');
    mockRules.splice(index, 1);
  },

  // 文档生成相关
  generateCoursePDF: async (courseId: string) => {
    await delay(1000);
    return { url: `http://example.com/course_${courseId}_rules.pdf` };
  },

  generateHandbook: async () => {
    await delay(2000);
    return { url: 'http://example.com/complete_handbook.pdf' };
  },

  exportRules: async () => {
    await delay(1000);
    return { url: 'http://example.com/rules_export.json' };
  },

  // 设置相关
  getSettings: async () => {
    await delay(500);
    return { ...mockSettings };
  },

  updateSettings: async (newSettings: Partial<Settings>) => {
    await delay(500);
    Object.assign(mockSettings, newSettings);
    return { ...mockSettings };
  },
};