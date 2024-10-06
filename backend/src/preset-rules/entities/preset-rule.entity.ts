import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Course } from '../../courses/entities/course.entity'
import { Requirement } from '../../requirements/entities/requirement.entity'
import { PresetRuleType } from './preset-rule.enum'

@Entity('preset-rules')
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

  @ManyToOne(() => Course, (course) => course.rules)
  course: Course

  @OneToMany(() => Requirement, (requirement) => requirement.rule)
  requirements: Requirement[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
