import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUnique1728283580504 implements MigrationInterface {
  name = 'AddUnique1728283580504'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_0023f81631f4d9ab057ad0b487\` ON \`preset-courses\``)
    await queryRunner.query(
      `ALTER TABLE \`preset-courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_0023f81631f4d9ab057ad0b487\` ON \`preset-courses\` (\`code\`, \`type\`)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_0023f81631f4d9ab057ad0b487\` ON \`preset-courses\``)
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset-courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_0023f81631f4d9ab057ad0b487\` ON \`preset-courses\` (\`code\`, \`type\`)`
    )
  }
}
