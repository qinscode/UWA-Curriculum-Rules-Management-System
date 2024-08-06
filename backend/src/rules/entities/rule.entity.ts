import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm'
import { RuleHistory } from './rule-history.entity'

@Entity('rules')
export class Rule {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ length: 10, unique: true })
  code: string

  @Column()
  name: string

  @Column({ type: 'enum', enum: ['conversion', 'core', 'option'] })
  type: string

  @Column('text')
  description: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date

  @OneToMany(() => RuleHistory, (history) => history.rule)
  history: RuleHistory[]
}
