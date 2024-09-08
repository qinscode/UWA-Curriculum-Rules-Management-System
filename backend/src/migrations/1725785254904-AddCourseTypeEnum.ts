import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCourseTypeEnum1725785254904 implements MigrationInterface {
    name = 'AddCourseTypeEnum1725785254904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`courses\` ADD \`course_type\` enum ('Graduate Certificate', 'Graduate Diploma', 'Master''s (Coursework)', 'Master''s Extended', 'Master''s Research', 'Doctoral Degree', 'Professional Doctorate/Master''s Coursework') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`courses\` DROP COLUMN \`course_type\``);
    }

}
