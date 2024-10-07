import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUnique1728241544215 implements MigrationInterface {
  name = 'AddUnique1728241544215'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`FK_4b2f5d8912c5dc0ed8db00b7aeb\` ON \`preset-rules\``)
    await queryRunner.query(
      `ALTER TABLE \`preset_course\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset-rules\` ADD CONSTRAINT \`FK_4b2f5d8912c5dc0ed8db00b7aeb\` FOREIGN KEY (\`presetCourseId\`) REFERENCES \`preset_course\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset_course\` ADD CONSTRAINT \`UQ_preset_course_type\` UNIQUE (\`type\`)`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`preset_course\` DROP CONSTRAINT \`UQ_preset_course_type\``
    )

    await queryRunner.query(
      `ALTER TABLE \`preset-rules\` DROP FOREIGN KEY \`FK_4b2f5d8912c5dc0ed8db00b7aeb\``
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset_course\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `CREATE INDEX \`FK_4b2f5d8912c5dc0ed8db00b7aeb\` ON \`preset-rules\` (\`presetCourseId\`)`
    )
  }
}
