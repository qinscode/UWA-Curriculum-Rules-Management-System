import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RulesService } from './rules.service'
import { RulesController } from './rules.controller'
import { Rule } from './entities/rule.entity'
import { Requirement } from './entities/requirement.entity'
import { Course } from '../courses/entities/course.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Rule, Requirement, Course])],
  providers: [RulesService],
  controllers: [RulesController],
})
export class RulesModule {}
