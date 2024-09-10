import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPreset1725980414430 implements MigrationInterface {
  name = 'AddPreset1725980414430'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`preset_rules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`type\` enum ('English Eligibility', 'Admissions', 'Satisfactory Progress', 'Progress Status', 'Award with Distinction', 'Deferrals', 'Additional Rules', 'Skills', 'Knowledge Application', 'Knowledge', 'Ranking and selection for admission') NOT NULL, \`description\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`preset_requirements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL DEFAULT 'content', \`style\` varchar(255) NOT NULL DEFAULT 'aa', \`is_connector\` tinyint(1) NOT NULL, \`order_index\` int NOT NULL DEFAULT '0', \`parentId\` int NULL, \`presetRuleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset_requirements\` ADD CONSTRAINT \`FK_58308b068e6906206ecf8bacab0\` FOREIGN KEY (\`parentId\`) REFERENCES \`preset_requirements\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`preset_requirements\` ADD CONSTRAINT \`FK_8adf438f2b0fb0770753dd23388\` FOREIGN KEY (\`presetRuleId\`) REFERENCES \`preset_rules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`preset_requirements\` DROP FOREIGN KEY \`FK_8adf438f2b0fb0770753dd23388\``
    )
    await queryRunner.query(
      `ALTER TABLE \`preset_requirements\` DROP FOREIGN KEY \`FK_58308b068e6906206ecf8bacab0\``
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(`DROP TABLE \`preset_requirements\``)
    await queryRunner.query(`DROP TABLE \`preset_rules\``)
  }
}
