import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PresetRule } from './entities/preset-rule.entity'
import { PresetRequirement } from '../preset-requirements/entities/preset-requirement.entity'
import { PresetRulesService } from './preset-rules.service'
import { PresetRulesController } from './preset-rules.controller'

@Module({
  imports: [TypeOrmModule.forFeature([PresetRule, PresetRequirement])],
  providers: [PresetRulesService],
  controllers: [PresetRulesController],
  exports: [TypeOrmModule, PresetRulesService],
})
export class PresetRulesModule {}
