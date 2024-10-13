import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMoreRuleType1726073302707 implements MigrationInterface {
  name = 'AddMoreRuleType1726073302707'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`preset_requirements\` CHANGE \`style\` \`style\` varchar(255) NOT NULL DEFAULT 'aa.ts'`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`rules\` CHANGE \`type\` \`type\` enum ('Applicability of the Student Rules, policies and procedures', 'Academic Conduct Essentials and Communication and Research Skills modules', 'English Eligibility', 'Admissions', 'Satisfactory Progress', 'Progress Status', 'Award with Distinction', 'Deferrals', 'Additional Rules', 'Skills', 'Knowledge Application', 'Knowledge', 'Ranking and selection for admission', 'ARTICULATION_AND_EXIT_AWARDS', 'COURSE_STRUCTURE') NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE \`requirements\` DROP COLUMN \`style\``)
    await queryRunner.query(
      `ALTER TABLE \`requirements\` ADD \`style\` enum ('numeric', 'alphabetic', 'roman', 'none') NOT NULL DEFAULT 'numeric'`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`requirements\` DROP COLUMN \`style\``)
    await queryRunner.query(
      `ALTER TABLE \`requirements\` ADD \`style\` varchar(255) NOT NULL DEFAULT 'aa'`
    )
    await queryRunner.query(
      `ALTER TABLE \`rules\` CHANGE \`type\` \`type\` enum ('English Eligibility', 'Admissions', 'Satisfactory Progress', 'Progress Status', 'Award with Distinction', 'Deferrals', 'Additional Rules', 'Skills', 'Knowledge Application', 'Knowledge', 'Ranking and selection for admission') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset_requirements\` CHANGE \`style\` \`style\` varchar(255) NOT NULL DEFAULT 'aa'`
    )
  }
}
