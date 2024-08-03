export class UpdateSettingsDto {
  universityName?: string;
  academicYear?: string;
  pdfTemplate?: string;
  handbookFormat?: 'pdf' | 'html' | 'docx';
  defaultUserRole?: 'admin' | 'editor' | 'viewer';
}