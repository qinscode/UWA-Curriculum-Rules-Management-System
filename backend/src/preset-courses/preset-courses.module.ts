import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PresetCourse } from './entities/preset-course.entity'
import { PresetCoursesService } from './preset-courses.service'
import { PresetCoursesController } from './preset-courses.controller'
import { PresetRulesModule } from '../preset-rules/preset-rules.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([PresetCourse]),
    forwardRef(() => PresetRulesModule), // 使用 forwardRef 来处理循环依赖
  ],
  providers: [PresetCoursesService],
  controllers: [PresetCoursesController],
  exports: [TypeOrmModule, PresetCoursesService],
})
export class PresetCoursesModule {}
