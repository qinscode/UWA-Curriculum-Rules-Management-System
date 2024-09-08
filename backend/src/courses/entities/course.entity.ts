import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { Rule } from '../../rules/entities/rule.entity'

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  code: string

  @Column()
  name: string

  @Column('text')
  description: string

  @Column()
  version: number

  @Column()
  is_current: boolean

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => Rule, (rule) => rule.course)
  rules: Rule[]
}
