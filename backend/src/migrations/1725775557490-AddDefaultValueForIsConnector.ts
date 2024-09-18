import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddDefaultValueForIsConnector1725775557490 implements MigrationInterface {
  name = 'AddDefaultValueForIsConnector1725775557490'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`is_connector\` \`is_connector\` tinyint NOT NULL DEFAULT 0`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`requirement\` CHANGE \`is_connector\` \`is_connector\` tinyint NOT NULL`
    )
  }
}
