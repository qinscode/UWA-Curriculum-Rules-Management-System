import { MigrationInterface, QueryRunner } from 'typeorm'

export class UppdateCourseCodeType1725864372896 implements MigrationInterface {
  name = 'UppdateCourseCodeType1725864372896'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE \`courses\` DROP COLUMN \`version\``)
    await queryRunner.query(`ALTER TABLE \`courses\` ADD \`version\` varchar(255) NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`content\` \`content\` varchar(255) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`style\` \`style\` varchar(255) NOT NULL DEFAULT 'aa'`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`is_connector\` \`is_connector\` tinyint NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`order_index\` \`order_index\` int NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`order_index\` \`order_index\` int NOT NULL DEFAULT '1'`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`is_connector\` \`is_connector\` tinyint NOT NULL DEFAULT '0'`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`style\` \`style\` varchar(255) NOT NULL DEFAULT 'a'`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`content\` \`content\` varchar(255) NULL`
    )
    await queryRunner.query(`ALTER TABLE \`courses\` DROP COLUMN \`version\``)
    await queryRunner.query(`ALTER TABLE \`courses\` ADD \`version\` int NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
  }
}
