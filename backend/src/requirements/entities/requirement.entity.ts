import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Rule } from '../../rules/entities/rule.entity'
// import { NumberingStyle } from './style.enum'
@Entity()
export class Requirement {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  content: string

  @Column({ default: 'aa' })
  style: string

  @ManyToOne(() => Requirement, (requirement) => requirement.children, { nullable: true })
  parent: Requirement

  @OneToMany(() => Requirement, (requirement) => requirement.parent)
  children: Requirement[]

  @ManyToOne(() => Rule, (rule) => rule.requirements)
  rule: Rule

  @Column({ name: 'is_connector' })
  isConnector: boolean

  @Column({ name: 'order_index' })
  order_index: number
}
