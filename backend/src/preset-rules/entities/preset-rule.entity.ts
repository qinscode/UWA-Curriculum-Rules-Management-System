import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { PresetRequirement } from '../../preset-requirements/entities/preset-requirement.entity'
import { PresetRuleType } from './preset-rule.enum'

@Entity('preset_rules')
export class PresetRule {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({
    type: 'enum',
    enum: PresetRuleType,
  })
  type: PresetRuleType

  @Column('text')
  description: string

  @OneToMany(() => PresetRequirement, (presetRequirement) => presetRequirement.presetRule)
  presetRequirements: PresetRequirement[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
