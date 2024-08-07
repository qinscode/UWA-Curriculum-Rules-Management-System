import { Controller, Get, Param } from '@nestjs/common'
import { DocumentsService } from './documents.service'

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('course/:id/pdf')
  generateCoursePDF(@Param('id') id: string) {
    return this.documentsService.generateCoursePDF(id)
  }

  // @Get('handbook')
  // generateHandbook() {
  //   return this.documentsService.generateHandbook()
  // }

  // @Get('rules/export')
  // exportRules() {
  //   return this.documentsService.exportRules()
  // }
}
