import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm'
import { Rule } from './rule.entity'

@Entity('rule_history')
export class RuleHistory {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  ruleId: number

  @Column({ nullable: true })
  code: string

  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  type: string

  @Column({ type: 'text', nullable: true })
  description: string

  @Column()
  version: number

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  timestamp: Date

  @ManyToOne(() => Rule, (rule) => rule.history)
  rule: Rule
}
