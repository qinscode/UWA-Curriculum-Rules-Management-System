import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Rule } from '../../rules/entities/rule.entity'
import { CourseType } from './course-type.enum'

@Entity('courses')
export class Course {
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
    enum: CourseType,
  })
  type: CourseType

  @Column()
  version: string

  @Column()
  is_current: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => Rule, (rule) => rule.course)
  rules: Rule[]
}
