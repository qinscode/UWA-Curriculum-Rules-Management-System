import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { PresetRule } from '../../preset-rules/entities/preset-rule.entity'
import { PresetCourseType } from './preset-course-type.enum'

@Entity('preset_courses')
export class PresetCourse {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  code: string

  @Column({ nullable: false })
  name: string

  @Column('text', { nullable: true })
  description: string

  @Column({
    type: 'enum',
    enum: PresetCourseType,
  })
  type: PresetCourseType

  @Column()
  version: string

  @Column()
  is_current: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => PresetRule, (presetRule) => presetRule.presetCourse)
  presetRules: PresetRule[]
}
