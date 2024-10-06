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
import { CourseType } from '../../courses/entities/course-type.enum'

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

  @Column({
    type: 'enum',
    enum: CourseType,
  })
  course_type: CourseType

  @OneToMany(() => PresetRequirement, (presetRequirement) => presetRequirement.presetRule)
  presetRequirements: PresetRequirement[]
}
