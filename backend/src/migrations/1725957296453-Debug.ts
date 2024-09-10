import { MigrationInterface, QueryRunner } from 'typeorm'

export class Debug1725957296453 implements MigrationInterface {
  name = 'Debug1725957296453'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`requirements\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` varchar(255) NOT NULL DEFAULT 'content', \`style\` varchar(255) NOT NULL DEFAULT 'aa', \`is_connector\` tinyint(1) NOT NULL, \`order_index\` int NOT NULL DEFAULT '0', \`parentId\` int NULL, \`ruleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirements\` ADD CONSTRAINT \`FK_86d272ff511eb261ae19f005a25\` FOREIGN KEY (\`parentId\`) REFERENCES \`requirements\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirements\` ADD CONSTRAINT \`FK_ce2c202120a91012645ed7033bd\` FOREIGN KEY (\`ruleId\`) REFERENCES \`rules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`requirements\` DROP FOREIGN KEY \`FK_ce2c202120a91012645ed7033bd\``
    )
    await queryRunner.query(
      `ALTER TABLE \`requirements\` DROP FOREIGN KEY \`FK_86d272ff511eb261ae19f005a25\``
    )
    await queryRunner.query(
      `ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`
    )
    await queryRunner.query(`DROP TABLE \`requirements\``)
  }
}
