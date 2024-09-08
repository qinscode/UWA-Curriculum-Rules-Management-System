import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateEmue1725798857035 implements MigrationInterface {
  name = 'UpdateEmue1725798857035'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`rules\` CHANGE \`type\` \`type\` enum ('English Eligibility', 'Admissions', 'Satisfactory Progress', 'Progress Status', 'Award with Distinction', 'Deferrals', 'Additional Rules', 'AQF Outcomes', 'Skills', 'Knowledge Application') NOT NULL`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`rules\` CHANGE \`type\` \`type\` enum ('English language eligibility requirements', 'Admissions', 'Satisfactory Progress', 'Progress Status', 'Award with distinction', 'Deferrals', 'Additional rules', 'Outcomes & Australian Qualifications Framework', 'Skills', 'Application of knowledge to skills') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
  }
}
