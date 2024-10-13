import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUnique1728281683262 implements MigrationInterface {
  name = 'AddUnique1728281683262'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`rules\` DROP FOREIGN KEY \`FK_59d5b1a323d6e79e00e18bbc43b\``
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`version\` \`version\` varchar(255) NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`is_current\` \`is_current\` tinyint NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`rules\` CHANGE \`type\` \`type\` enum ('Applicability of the Student Rules policies and procedures', 'Academic Conduct Essentials and Communication and Research Skills modules', 'English Eligibility', 'Admissions', 'Satisfactory Progress', 'Progress Status', 'Award with Distinction', 'Deferrals', 'Additional Rules', 'Skills', 'Knowledge Application', 'Knowledge', 'Ranking and selection for admission', 'Articulation Exit Award', 'Course Structure') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset_course\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`rules\` ADD CONSTRAINT \`FK_59d5b1a323d6e79e00e18bbc43b\` FOREIGN KEY (\`courseId\`) REFERENCES \`courses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset-rules\` ADD CONSTRAINT \`FK_4b2f5d8912c5dc0ed8db00b7aeb\` FOREIGN KEY (\`presetCourseId\`) REFERENCES \`preset_course\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`preset-rules\` DROP FOREIGN KEY \`FK_4b2f5d8912c5dc0ed8db00b7aeb\``
    )
    await queryRunner.query(
      `ALTER TABLE \`rules\` DROP FOREIGN KEY \`FK_59d5b1a323d6e79e00e18bbc43b\``
    )
    await queryRunner.query(
      `ALTER TABLE \`preset_course\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`rules\` CHANGE \`type\` \`type\` enum ('Applicability of the Student Rules policies and procedures', 'Academic Conduct Essentials and Communication and Research Skills modules', 'English Eligibility', 'Admissions', 'Satisfactory Progress', 'Progress Status', 'Award with Distinction', 'Deferrals', 'Additional Rules', 'Skills', 'Knowledge Application', 'Knowledge', 'Ranking and selection for admission', 'ARTICULATION_AND_EXIT_AWARDS', 'COURSE_STRUCTURE') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`is_current\` \`is_current\` tinyint NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`version\` \`version\` varchar(255) NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`rules\` ADD CONSTRAINT \`FK_59d5b1a323d6e79e00e18bbc43b\` FOREIGN KEY (\`courseId\`) REFERENCES \`courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
