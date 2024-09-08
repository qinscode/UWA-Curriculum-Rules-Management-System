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
import { Requirement } from './requirement.entity'

@Entity('rules')
export class Rule {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  code: string

  @Column()
  name: string

  @Column()
  type: string

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
