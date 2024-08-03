import { MigrationInterface, QueryRunner } from "typeorm"

export class UpdateSettingsColumns1234567890126 implements MigrationInterface {
    name = 'UpdateSettingsColumns1234567890126'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`settings\` CHANGE \`university_name\` \`universityName\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`settings\` CHANGE \`academic_year\` \`academicYear\` VARCHAR(9) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`settings\` CHANGE \`pdf_template\` \`pdfTemplate\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`settings\` CHANGE \`handbook_format\` \`handbookFormat\` ENUM('pdf', 'html', 'docx') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`settings\` CHANGE \`default_user_role\` \`defaultUserRole\` ENUM('admin', 'editor', 'viewer') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`settings\` CHANGE \`universityName\` \`university_name\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`settings\` CHANGE \`academicYear\` \`academic_year\` VARCHAR(9) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`settings\` CHANGE \`pdfTemplate\` \`pdf_template\` VARCHAR(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`settings\` CHANGE \`handbookFormat\` \`handbook_format\` ENUM('pdf', 'html', 'docx') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`settings\` CHANGE \`defaultUserRole\` \`default_user_role\` ENUM('admin', 'editor', 'viewer') NOT NULL`);
    }
}