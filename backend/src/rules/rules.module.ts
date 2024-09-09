import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { Requirement } from '../requirements/entities/requirement.entity'
import { RulesService } from './rules.service'
import { RulesController } from './rules.controller'
import { CoursesModule } from '../courses/courses.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([Rule, Requirement]),
    forwardRef(() => CoursesModule), // 使用 forwardRef 来处理循环依赖
  ],
  providers: [RulesService],
  controllers: [RulesController],
  exports: [TypeOrmModule, RulesService],
})
export class RulesModule {}
