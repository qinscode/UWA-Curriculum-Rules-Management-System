import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1722681261313 implements MigrationInterface {
    name = 'InitialMigration1722681261313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`settings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`university_name\` varchar(255) NOT NULL, \`academic_year\` varchar(9) NOT NULL, \`pdf_template\` varchar(255) NOT NULL, \`handbook_format\` enum ('pdf', 'html', 'docx') NOT NULL, \`default_user_role\` enum ('admin', 'editor', 'viewer') NOT NULL, \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`rules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`code\` varchar(10) NOT NULL, \`name\` varchar(255) NOT NULL, \`type\` enum ('Standard', 'Custom') NOT NULL, \`description\` text NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_5ac936be5308d9147c81452d33\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_5ac936be5308d9147c81452d33\` ON \`rules\``);
        await queryRunner.query(`DROP TABLE \`rules\``);
        await queryRunner.query(`DROP TABLE \`settings\``);
    }

}
