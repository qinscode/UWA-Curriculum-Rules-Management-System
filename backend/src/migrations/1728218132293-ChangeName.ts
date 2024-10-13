import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangeName1728218132293 implements MigrationInterface {
  name = 'ChangeName1728218132293'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`preset-courses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL, \`version\` varchar(255) NOT NULL, \`is_current\` tinyint NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`preset-requirements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`style\` enum ('numeric', 'alphabetic', 'roman', 'none') NOT NULL DEFAULT 'numeric', \`is_connector\` tinyint(1) NOT NULL, \`order_index\` int NOT NULL DEFAULT '0', \`parentId\` int NULL, \`presetRuleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`preset-rules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` enum ('Applicability of the Student Rules policies and procedures', 'Academic Conduct Essentials and Communication and Research Skills modules', 'English Eligibility', 'Admissions', 'Satisfactory Progress', 'Progress Status', 'Award with Distinction', 'Deferrals', 'Additional Rules', 'Skills', 'Knowledge Application', 'Knowledge', 'Ranking and selection for admission', 'ARTICULATION_AND_EXIT_AWARDS', 'COURSE_STRUCTURE') NOT NULL, \`description\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`presetCourseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset-requirements\` ADD CONSTRAINT \`FK_8f32544d923d3358a5069cb8ad4\` FOREIGN KEY (\`parentId\`) REFERENCES \`preset-requirements\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset-requirements\` ADD CONSTRAINT \`FK_cd7f6b03f6f349dbee0d4eca0d8\` FOREIGN KEY (\`presetRuleId\`) REFERENCES \`preset-rules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset-rules\` ADD CONSTRAINT \`FK_4b2f5d8912c5dc0ed8db00b7aeb\` FOREIGN KEY (\`presetCourseId\`) REFERENCES \`preset-courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`preset-rules\` DROP FOREIGN KEY \`FK_4b2f5d8912c5dc0ed8db00b7aeb\``
    )
    await queryRunner.query(
      `ALTER TABLE \`preset-requirements\` DROP FOREIGN KEY \`FK_cd7f6b03f6f349dbee0d4eca0d8\``
    )
    await queryRunner.query(
      `ALTER TABLE \`preset-requirements\` DROP FOREIGN KEY \`FK_8f32544d923d3358a5069cb8ad4\``
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(`DROP TABLE \`preset-rules\``)
    await queryRunner.query(`DROP TABLE \`preset-requirements\``)
    await queryRunner.query(`DROP TABLE \`preset-courses\``)
  }
}
