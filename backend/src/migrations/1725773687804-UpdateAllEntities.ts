import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateAllEntities1725773687804 implements MigrationInterface {
  name = 'UpdateAllEntities1725773687804'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_5ac936be5308d9147c81452d33\` ON \`rules\``)
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`requirement\` (\`id\` int NOT NULL AUTO_INCREMENT, \`content\` text NOT NULL, \`style\` varchar(255) NOT NULL, \`parent_id\` int NULL, \`is_connector\` tinyint NOT NULL, \`order_index\` int NOT NULL, \`ruleId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `CREATE TABLE \`courses\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`description\` text NOT NULL, \`version\` int NOT NULL, \`is_current\` tinyint NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(`ALTER TABLE \`rules\` ADD \`courseId\` int NULL`)
    await queryRunner.query(`ALTER TABLE \`rules\` DROP COLUMN \`code\``)
    await queryRunner.query(`ALTER TABLE \`rules\` ADD \`code\` varchar(255) NOT NULL`)
    await queryRunner.query(`ALTER TABLE \`rules\` DROP COLUMN \`type\``)
    await queryRunner.query(`ALTER TABLE \`rules\` ADD \`type\` varchar(255) NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE \`rules\` CHANGE \`description\` \`description\` text NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` ADD CONSTRAINT \`FK_b9e59db0f1e9e0d7b00aa8295ab\` FOREIGN KEY (\`ruleId\`) REFERENCES \`rules\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE \`rules\` ADD CONSTRAINT \`FK_59d5b1a323d6e79e00e18bbc43b\` FOREIGN KEY (\`courseId\`) REFERENCES \`courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`rules\` DROP FOREIGN KEY \`FK_59d5b1a323d6e79e00e18bbc43b\``
    )
    await queryRunner.query(
      `ALTER TABLE \`requirement\` DROP FOREIGN KEY \`FK_b9e59db0f1e9e0d7b00aa8295ab\``
    )
    await queryRunner.query(
      `ALTER TABLE \`rules\` CHANGE \`description\` \`description\` text NULL`
    )
    await queryRunner.query(`ALTER TABLE \`rules\` DROP COLUMN \`type\``)
    await queryRunner.query(
      `ALTER TABLE \`rules\` ADD \`type\` enum ('Coursework', 'Master Research', 'PhD') NULL`
    )
    await queryRunner.query(`ALTER TABLE \`rules\` DROP COLUMN \`code\``)
    await queryRunner.query(`ALTER TABLE \`rules\` ADD \`code\` varchar(10) NOT NULL`)
    await queryRunner.query(`ALTER TABLE \`rules\` DROP COLUMN \`courseId\``)
    await queryRunner.query(`DROP TABLE \`courses\``)
    await queryRunner.query(`DROP TABLE \`requirement\``)
    await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``)
    await queryRunner.query(`DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\` ON \`users\``)
    await queryRunner.query(`DROP TABLE \`users\``)
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_5ac936be5308d9147c81452d33\` ON \`rules\` (\`code\`)`
    )
  }
}
