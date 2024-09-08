import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Rule } from '../../rules/entities/rule.entity'

@Entity()
export class Requirement {
  @PrimaryGeneratedColumn()
  id: number

  @Column('text')
  content: string

  @Column()
  style: string

  @ManyToOne(() => Requirement, (requirement) => requirement.children, { nullable: true })
  parent: Requirement

  @OneToMany(() => Requirement, (requirement) => requirement.parent)
  children: Requirement[]

  @ManyToOne(() => Rule, (rule) => rule.requirements)
  rule: Rule

  @Column({ default: false })
  is_connector: boolean

  @Column()
  order_index: number
}
