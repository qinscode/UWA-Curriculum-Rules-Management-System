import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSettingsColumns1722683120861 implements MigrationInterface {
    name = 'UpdateSettingsColumns1722683120861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`settings\` CHANGE \`updated_at\` \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`settings\` CHANGE \`updatedAt\` \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

}
