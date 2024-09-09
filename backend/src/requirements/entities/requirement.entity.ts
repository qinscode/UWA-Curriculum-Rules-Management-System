import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { Rule } from '../../rules/entities/rule.entity'

@Entity()
export class Requirement {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ default: 'content' })
  content: string

  @Column({ default: 'aa' })
  style: string

  @ManyToOne(() => Requirement, (requirement) => requirement.children, {
    nullable: true,
    onDelete: 'CASCADE', // Add this line to enable cascade delete
  })
  parent: Requirement

  @OneToMany(() => Requirement, (requirement) => requirement.parent, {
    cascade: true, // Add this line to enable cascade operations
  })
  children: Requirement[]

  @ManyToOne(() => Rule, (rule) => rule.requirements)
  rule: Rule

  @Column({ name: 'is_connector', default: false })
  isConnector: boolean

  @Column({ name: 'order_index', default: 0 })
  order_index: number
}
