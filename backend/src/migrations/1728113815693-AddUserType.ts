import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUserType1728113815693 implements MigrationInterface {
  name = 'AddUserType1728113815693'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`type\``)
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`type\` enum ('admin', 'normal') NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`type\``)
    await queryRunner.query(`ALTER TABLE \`users\` ADD \`type\` enum ('admin', 'normal') NOT NULL`)
  }
}
