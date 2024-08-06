import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class AddRuleHistory1722935855700 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 创建 rule_history 表
    await queryRunner.createTable(
      new Table({
        name: 'rule_history',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'ruleId',
            type: 'int',
          },
          {
            name: 'code',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'type',
            type: 'enum',
            enum: ['conversion', 'core', 'option'],
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'version',
            type: 'int',
          },
          {
            name: 'timestamp',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    )

    // 为现有的规则创建历史记录
    await queryRunner.query(`
            INSERT INTO rule_history (ruleId, code, name, type, description, version, timestamp)
            SELECT id, code, name, type, description, 1, CURRENT_TIMESTAMP
            FROM rules
        `)

    // 添加外键约束
    await queryRunner.createForeignKey(
      'rule_history',
      new TableForeignKey({
        columnNames: ['ruleId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'rules',
        onDelete: 'CASCADE',
      })
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('rule_history')
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf('ruleId') !== -1)
    await queryRunner.dropForeignKey('rule_history', foreignKey)
    await queryRunner.dropTable('rule_history')
  }
}
