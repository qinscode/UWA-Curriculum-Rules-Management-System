import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Rule } from './rule.entity'

@Entity('requirements')
export class Requirement {
  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  content: string

  @Column()
  style: string

  @Column({ nullable: true })
  parent_id: number

  @ManyToOne(() => Rule, (rule) => rule.requirements)
  rule: Rule

  @Column()
  is_connector: boolean

  @Column()
  order_index: number

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
