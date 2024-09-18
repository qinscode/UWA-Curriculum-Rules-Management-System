import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Course } from './entities/course.entity'
import { CoursesService } from './courses.service'
import { CoursesController } from './courses.controller'

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [TypeOrmModule, CoursesService],
})
export class CoursesModule {}
