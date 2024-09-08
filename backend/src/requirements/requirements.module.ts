import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RequirementsService } from './requirements.service'
import { RequirementsController } from './requirements.controller'
import { Requirement } from './entities/requirement.entity'
import { Rule } from '../rules/entities/rule.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Requirement, Rule])],
  providers: [RequirementsService],
  controllers: [RequirementsController],
  exports: [RequirementsService],
})
export class RequirementsModule {}
