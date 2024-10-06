import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PresetCoursesController } from './preset-courses.controller'
import { PresetCoursesService } from './preset-courses.service'
import { PresetCourse } from './entities/preset-course.entity'
import { PresetRule } from '../preset-rules/entities/preset-rule.entity'

@Module({
  imports: [TypeOrmModule.forFeature([PresetCourse, PresetRule])],
  controllers: [PresetCoursesController],
  providers: [PresetCoursesService],
})
export class PresetCoursesModule {}
