import { Controller, Get, Param } from '@nestjs/common';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('course-pdf/:courseId')
  generateCoursePDF(@Param('courseId') courseId: string) {
    return this.documentsService.generateCoursePDF(courseId);
  }

  @Get('handbook')
  generateHandbook() {
    return this.documentsService.generateHandbook();
  }

  @Get('export-rules')
  exportRules() {
    return this.documentsService.exportRules();
  }
}