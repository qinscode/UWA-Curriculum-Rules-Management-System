import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentsService {
  generateCoursePDF(courseId: string) {
    // Moec generating course PDF
    return { url: `http://example.com/course_${courseId}_rules.pdf` };
  }

  generateHandbook() {
    // Mock generating handbook
    return { url: 'http://example.com/complete_handbook.pdf' };
  }

  exportRules() {
    // Mock exporting rules
    return { url: 'http://example.com/rules_export.json' };
  }
}