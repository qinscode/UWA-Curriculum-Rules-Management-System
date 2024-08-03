import { MigrationInterface, QueryRunner } from "typeorm"

export class InsertTestData1234567890125 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`INSERT INTO rules (code, name, type, description) VALUES 
            ('ENG101', 'English Composition', 'Standard', 'Fundamentals of writing'),
            ('PHYS201', 'Classical Mechanics', 'Standard', 'Newtonian physics principles'),
            ('CHEM101', 'General Chemistry', 'Custom', 'Basic concepts in chemistry'),
            ('BIO201', 'Molecular Biology', 'Custom', 'Study of biological molecules')`);

        await queryRunner.query(`UPDATE settings SET 
            university_name = 'Acme University', 
            academic_year = '2023-2024', 
            pdf_template = 'template2', 
            handbook_format = 'pdf', 
            default_user_role = 'editor' 
            WHERE id = 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM rules WHERE code IN ('ENG101', 'PHYS201', 'CHEM101', 'BIO201')`);
        await queryRunner.query(`UPDATE settings SET 
            university_name = 'Example University', 
            academic_year = '2023-2024', 
            pdf_template = 'template1', 
            handbook_format = 'pdf', 
            default_user_role = 'editor' 
            WHERE id = 1`);
    }
}