import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { NumberingStyle } from './style.enum'
import { PresetRule } from '../../preset-rules/entities/preset-rule.entity'

@Entity('preset-requirements')
export class PresetRequirement {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  content: string

  @Column({
    type: 'enum',
    enum: NumberingStyle,
    default: NumberingStyle.Numeric,
  })
  style: NumberingStyle

  @ManyToOne(() => PresetRequirement, (requirement) => requirement.children, {
    nullable: true,
    onDelete: 'CASCADE', // Add this line to enable cascade delete
  })
  parent: PresetRequirement

  @OneToMany(() => PresetRequirement, (requirement) => requirement.parent, {
    cascade: true, // Add this line to enable cascade operations
  })
  children: PresetRequirement[]

  @ManyToOne(() => PresetRule, (rule) => rule.requirements)
  rule: PresetRule

  @Column({
    name: 'is_connector',
    type: 'tinyint',
    width: 1,
    transformer: {
      to: (value: boolean) => (value ? 1 : 0),
      from: (value: number) => value === 1,
    },
  })
  is_connector: boolean

  @Column({ name: 'order_index', default: 0 })
  order_index: number

  @Column({ nullable: true })
  parentId: number
}
