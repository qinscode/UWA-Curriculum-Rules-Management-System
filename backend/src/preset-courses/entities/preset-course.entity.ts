import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
} from 'typeorm'
import { PresetRule } from '../../preset-rules/entities/preset-rule.entity'
import { PresetCourseType } from './preset-course-type.enum'

@Entity('preset-courses')
@Unique(['code', 'type'])
export class PresetCourse {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: false })
  code: string

  @Column({ nullable: true })
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

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => PresetRule, (presetRule) => presetRule.presetCourse, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  presetRules: PresetRule[]
}
