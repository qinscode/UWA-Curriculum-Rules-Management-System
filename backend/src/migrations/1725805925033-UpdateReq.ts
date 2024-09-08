import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReq1725805925033 implements MigrationInterface {
    name = 'UpdateReq1725805925033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`requirement\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`requirement\` ADD \`content\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`requirement\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`requirement\` ADD \`content\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`courses\` CHANGE \`type\` \`type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''''s (Coursework)', 'Master''''s Extended', 'Master''''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''''s Coursework') NOT NULL`);
    }

}
