import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateEmue1725794828818 implements MigrationInterface {
  name = 'UpdateEmue1725794828818'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`rules\` DROP COLUMN \`type\``)
    await queryRunner.query(
      `ALTER TABLE \`rules\` ADD \`type\` enum ('English language eligibility requirements', 'Admissions', 'Satisfactory Progress', 'Progress Status', 'Award with distinction', 'Deferrals', 'Additional rules', 'Outcomes & Australian Qualifications Framework', 'Skills', 'Application of knowledge to skills') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE \`rules\` DROP COLUMN \`type\``)
    await queryRunner.query(`ALTER TABLE \`rules\` ADD \`type\` varchar(255) NOT NULL`)
  }
}
