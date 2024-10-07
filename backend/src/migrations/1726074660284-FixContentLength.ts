import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixContentLength1726074660284 implements MigrationInterface {
  name = 'FixContentLength1726074660284'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
  }
}
