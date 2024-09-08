import { MigrationInterface, QueryRunner } from 'typeorm'

export class NestedRequirement1725801696036 implements MigrationInterface {
  name = 'NestedRequirement1725801696036'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`parent_id\` \`parentId\` int NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` ADD CONSTRAINT \`FK_84610cb25581d3854d0e45c3f1e\` FOREIGN KEY (\`parentId\`) REFERENCES \`requirement\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`requirement\` DROP FOREIGN KEY \`FK_84610cb25581d3854d0e45c3f1e\``
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`parentId\` \`parent_id\` int NULL`
    )
  }
}
