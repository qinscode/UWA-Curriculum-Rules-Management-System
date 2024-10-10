import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CoursesController } from './courses.controller'
import { CoursesService } from './courses.service'
import { Course } from './entities/course.entity'
import { Rule } from '../rules/entities/rule.entity'
import { Requirement } from '../requirements/entities/requirement.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Course, Rule, Requirement])],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService, TypeOrmModule],
})
export class CoursesModule {}
