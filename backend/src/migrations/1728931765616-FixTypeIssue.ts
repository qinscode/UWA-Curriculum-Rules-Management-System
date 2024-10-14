import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixTypeIssue1728931765616 implements MigrationInterface {
  name = 'FixTypeIssue1728931765616'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`rules\` CHANGE \`type\` \`type\` enum ('Applicability of the Student Rules policies and procedures', 'Academic Conduct Essentials and Communication and Research Skills modules', 'English Eligibility', 'Admissions', 'Satisfactory Progress', 'Progress Status', 'Award with Distinction', 'Deferrals', 'Ranking and selection for admission', 'Articulation Exit Award', 'Course Structure') NOT NULL`
    )
    await queryRunner.query(`DROP INDEX \`IDX_0023f81631f4d9ab057ad0b487\` ON \`preset-courses\``)
    await queryRunner.query(
      `ALTER TABLE \`preset-courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_0023f81631f4d9ab057ad0b487\` ON \`preset-courses\` (\`code\`, \`type\`)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_0023f81631f4d9ab057ad0b487\` ON \`preset-courses\``)
    await queryRunner.query(
      `ALTER TABLE \`preset-courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_0023f81631f4d9ab057ad0b487\` ON \`preset-courses\` (\`code\`, \`type\`)`
    )
    await queryRunner.query(
      `ALTER TABLE \`rules\` CHANGE \`type\` \`type\` enum ('Applicability of the Student Rules policies and procedures', 'Academic Conduct Essentials and Communication and Research Skills modules', 'English Eligibility', 'Admissions', 'Satisfactory Progress', 'Progress Status', 'Award with Distinction', 'Deferrals', 'Additional Rules', 'Skills', 'Knowledge Application', 'Knowledge', 'Ranking and selection for admission', 'Articulation Exit Award', 'Course Structure') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
  }
}
