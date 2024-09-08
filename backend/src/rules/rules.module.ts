import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Rule } from './entities/rule.entity'
import { Requirement } from '../requirements/entities/requirement.entity'
import { RulesService } from './rules.service'
import { RulesController } from './rules.controller'
import { CoursesModule } from '../courses/courses.module'

@Module({
  imports: [TypeOrmModule.forFeature([Rule, Requirement]), CoursesModule],
  providers: [RulesService],
  controllers: [RulesController],
  exports: [TypeOrmModule, RulesService],
})
export class RulesModule {}
