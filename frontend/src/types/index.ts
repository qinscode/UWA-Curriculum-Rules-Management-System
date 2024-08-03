export interface Rule {
  id: number;
  code: string;
  name: string;
  type: string;
  description: string;
}

export interface Settings {
  id: number;
  universityName: string;
  academicYear: string;
  pdfTemplate: string;
  handbookFormat: 'pdf' | 'html' | 'docx';
  defaultUserRole: 'admin' | 'editor' | 'viewer';
}

export type CreateRuleDTO = Omit<Rule, 'id'>;
export type UpdateRuleDTO = Partial<Omit<Rule, 'id'>>;
export type UpdateSettingsDTO = Partial<Omit<Settings, 'id'>>;