import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Setting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  universityName: string;

  @Column({ length: 9 })
  academicYear: string;

  @Column()
  pdfTemplate: string;

  @Column({ type: 'enum', enum: ['pdf', 'html', 'docx'] })
  handbookFormat: string;

  @Column({ type: 'enum', enum: ['admin', 'editor', 'viewer'] })
  defaultUserRole: string;

  @UpdateDateColumn()
  updated_at: Date;
}