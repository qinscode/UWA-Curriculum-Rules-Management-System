import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  university_name: string;

  @Column({ length: 9 })
  academic_year: string;

  @Column()
  pdf_template: string;

  @Column({ type: 'enum', enum: ['pdf', 'html', 'docx'] })
  handbook_format: string;

  @Column({ type: 'enum', enum: ['admin', 'editor', 'viewer'] })
  default_user_role: string;

  @UpdateDateColumn()
  updated_at: Date;
}