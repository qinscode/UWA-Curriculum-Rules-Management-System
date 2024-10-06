import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'
import { PresetRule } from '../../preset-rules/entities/preset-rule.entity'
import { NumberingStyle } from './style.enum'

@Entity('preset_requirements')
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

  @ManyToOne(() => PresetRequirement, (presetRequirement) => presetRequirement.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  parent: PresetRequirement

  @OneToMany(() => PresetRequirement, (presetRequirement) => presetRequirement.parent, {
    cascade: true,
  })
  children: PresetRequirement[]

  @ManyToOne(() => PresetRule, (presetRule) => presetRule.presetRequirements)
  presetRule: PresetRule

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
