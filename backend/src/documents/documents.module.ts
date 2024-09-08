import { Module } from '@nestjs/common'
import { DocumentsService } from './documents.service'
import { DocumentsController } from './documents.controller'
import { CoursesModule } from '../courses/courses.module'
import { RulesModule } from '../rules/rules.module'

@Module({
  imports: [CoursesModule, RulesModule],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
