import { MigrationInterface, QueryRunner } from 'typeorm'

export class FixTypeError1726203147864 implements MigrationInterface {
  name = 'FixTypeError1726203147864'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `AdLTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
  }
}
