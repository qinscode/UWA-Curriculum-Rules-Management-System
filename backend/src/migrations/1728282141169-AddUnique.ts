import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUnique1728282141169 implements MigrationInterface {
    name = 'AddUnique1728282141169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`UQ_preset_courses_type\` ON \`preset-courses\``);
        await queryRunner.query(`DROP INDEX \`FK_4b2f5d8912c5dc0ed8db00b7aeb\` ON \`preset-rules\``);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` DROP COLUMN \`is_current\``);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` ADD \`versions\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` ADD UNIQUE INDEX \`IDX_5ba0f73408d349b2a8b74530b5\` (\`type\`)`);
        await queryRunner.query(`ALTER TABLE \`preset-rules\` ADD CONSTRAINT \`FK_4b2f5d8912c5dc0ed8db00b7aeb\` FOREIGN KEY (\`presetCourseId\`) REFERENCES \`preset-courses\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`preset-rules\` DROP FOREIGN KEY \`FK_4b2f5d8912c5dc0ed8db00b7aeb\``);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` DROP INDEX \`IDX_5ba0f73408d349b2a8b74530b5\``);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` DROP COLUMN \`versions\``);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` ADD \`is_current\` tinyint NULL`);
        await queryRunner.query(`ALTER TABLE \`preset-courses\` ADD \`description\` text NULL`);
        await queryRunner.query(`CREATE INDEX \`FK_4b2f5d8912c5dc0ed8db00b7aeb\` ON \`preset-rules\` (\`presetCourseId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`UQ_preset_courses_type\` ON \`preset-courses\` (\`type\`)`);
    }

}
