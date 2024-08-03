import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'university_name' })
  universityName: string;

  @Column({ name: 'academic_year', length: 9 })
  academicYear: string;

  @Column({ name: 'pdf_template' })
  pdfTemplate: string;

  @Column({ name: 'handbook_format', type: 'enum', enum: ['pdf', 'html', 'docx'] })
  handbookFormat: string;

  @Column({ name: 'default_user_role', type: 'enum', enum: ['admin', 'editor', 'viewer'] })
  defaultUserRole: string;

  @UpdateDateColumn()
  updatedAt: Date;
}