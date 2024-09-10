import { MigrationInterface, QueryRunner } from 'typeorm'

export class DeleteCodeForRule1725775427786 implements MigrationInterface {
  name = 'DeleteCodeForRule1725775427786'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`rules\` DROP COLUMN \`code\``)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`rules\` ADD \`code\` varchar(255) NOT NULL`)
  }
}
