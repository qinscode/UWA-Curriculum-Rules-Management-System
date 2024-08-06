import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RulesController } from './rules.controller'
import { RulesService } from './rules.service'
import { Rule } from './entities/rule.entity'
import { RuleHistory } from './entities/rule-history.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Rule, RuleHistory])],
  controllers: [RulesController],
  providers: [RulesService],
})
export class RulesModule {}
