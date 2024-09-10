import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCascadeDeleteToRequirements1725875144555 implements MigrationInterface {
  name = 'AddCascadeDeleteToRequirements1725875144555'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`requirement\` DROP FOREIGN KEY \`FK_84610cb25581d3854d0e45c3f1e\``
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`content\` \`content\` varchar(255) NOT NULL DEFAULT 'content'`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`is_connector\` \`is_connector\` tinyint NOT NULL DEFAULT 0`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`order_index\` \`order_index\` int NOT NULL DEFAULT '0'`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` ADD CONSTRAINT \`FK_84610cb25581d3854d0e45c3f1e\` FOREIGN KEY (\`parentId\`) REFERENCES \`requirement\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`requirement\` DROP FOREIGN KEY \`FK_84610cb25581d3854d0e45c3f1e\``
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`order_index\` \`order_index\` int NOT NULL DEFAULT '3'`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`is_connector\` \`is_connector\` tinyint NOT NULL DEFAULT '1'`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`content\` \`content\` varchar(255) NOT NULL DEFAULT 'aaa'`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` ADD CONSTRAINT \`FK_84610cb25581d3854d0e45c3f1e\` FOREIGN KEY (\`parentId\`) REFERENCES \`requirement\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
