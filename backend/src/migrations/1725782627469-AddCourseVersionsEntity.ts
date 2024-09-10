import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddCourseVersionsEntity1725782627469 implements MigrationInterface {
  name = 'AddCourseVersionsEntity1725782627469'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`course_versions\` (\`id\` int NOT NULL AUTO_INCREMENT, \`version\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`courseId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    )
    await queryRunner.query(
      `ALTER TABLE \`course_versions\` ADD CONSTRAINT \`FK_afedc5469f7b236608580a4fe94\` FOREIGN KEY (\`courseId\`) REFERENCES \`courses\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`course_versions\` DROP FOREIGN KEY \`FK_afedc5469f7b236608580a4fe94\``
    )
    await queryRunner.query(`DROP TABLE \`course_versions\``)
  }
}
