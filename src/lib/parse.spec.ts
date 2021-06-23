import { parse } from './parse';
import * as TableTypes from '../types/table';

test('get columns config from mysql columns schema ', () => {
  const tableColumns: TableTypes.ColumnSchema[] = [
    {
      TABLE_CATALOG: '',
      TABLE_SCHEMA: 'databasename',
      /**
       * @description 表名称
       */
      TABLE_NAME: 'test',
      /**
       * @description 列字段名称
       */
      COLUMN_NAME: 'name',
      ORDINAL_POSITION: 1,
      /**
       * @description 列字段默认值
       */
      COLUMN_DEFAULT: 'dylan',
      IS_NULLABLE: 'not',
      /**
       * @description 列的类型
       */
      DATA_TYPE: 'int',
      CHARACTER_MAXIMUM_LENGTH: null,
      CHARACTER_OCTET_LENGTH: null,
      /**
       * @description 数字的精度
       */
      NUMERIC_PRECISION: 2,
      NUMERIC_SCALE: 2,
      DATETIME_PRECISION: 2,
      CHARACTER_SET_NAME: null,
      COLLATION_NAME: null,
      /**
       * @description 列的类型
       */
      COLUMN_TYPE: 'varchar',
      COLUMN_KEY: 'id',
      EXTRA: '',
      PRIVILEGES: '',
      /**
       * @description 列的中文名称
       */
      COLUMN_COMMENT: '姓名',
    },
  ];

  const columns = parse(tableColumns);
  expect(columns).toContainEqual({
    title: '姓名',
    name: 'name',
    description: '姓名',
    type: 'number',
  });
});
