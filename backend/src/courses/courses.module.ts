import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Course } from './entities/course.entity'
import { CoursesService } from './courses.service'
import { CoursesController } from './courses.controller'
import { RulesModule } from '../rules/rules.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    forwardRef(() => RulesModule), // 使用 forwardRef 来处理循环依赖
  ],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [TypeOrmModule, CoursesService],
})
export class CoursesModule {}
