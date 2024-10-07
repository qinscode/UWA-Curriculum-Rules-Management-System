import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdatePreset1728240898654 implements MigrationInterface {
  name = 'UpdatePreset1728240898654'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset-courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`preset-courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
  }
}
