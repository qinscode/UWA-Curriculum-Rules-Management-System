import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DocumentsService } from './documents.service'
import { DocumentsController } from './documents.controller'
import { Course } from '../courses/entities/course.entity'
import { Rule } from '../rules/entities/rule.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Course, Rule])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}
