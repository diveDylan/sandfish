/**
 * @description mysql column schema
 */
export interface ColumnSchema {

  TABLE_CATALOG: string,
  /**
   * @description 数据库名称
   */
  TABLE_SCHEMA: string,
  /**
   * @description 表名称
   */
  TABLE_NAME: string,
  /**
   * @description 列字段名称
   */
  COLUMN_NAME: string,
  /**
   * @description 在表格的位置
   */
  ORDINAL_POSITION: number,
  /**
   * @description 列字段默认值
   */
  COLUMN_DEFAULT: string,
  IS_NULLABLE: string,
  /**
   * @description 列的类型
   */
  DATA_TYPE: string,
  CHARACTER_MAXIMUM_LENGTH: null | number,
  CHARACTER_OCTET_LENGTH: null | number,
  /**
   * @description 数字的精度
   */
  NUMERIC_PRECISION: number,
  NUMERIC_SCALE: number,
  DATETIME_PRECISION: null | number,
  CHARACTER_SET_NAME: null,
  COLLATION_NAME: null,
  /**
   * @description 列的类型
   */
  COLUMN_TYPE: string,
  COLUMN_KEY: string,
  EXTRA: string,
  PRIVILEGES: string,
  /**
   * @description 列的中文名称
   */
  COLUMN_COMMENT: string
}

type Actions = 'select' | 'insert' | 'update' | 'references'

/**
 * @description 格式化给到模板的列格式
 */
export interface Column {
  render?: string
  name: string
  title: string
  type: string
  /**
   * @description 列的描述
   */
  description: string
}

/**
 * @description table config
 */
export interface Table {
  tableName: string
  /**
   * @description table的描述
   */
  columns: Partial<Column>[]
  tableDescription: string
}

/**
 * @description mysql table schema
 */
export interface MysqlTable {
  TABLE_CATALOG: string,
  /**
   * @description 数据库名字
   */
  TABLE_SCHEMA: string,
  /**
   * @description 表名字（database_history是系统默认表）
   */
  TABLE_NAME: string,
  /**
   * @description 表类型
   */
  TABLE_TYPE: string,
  ENGINE: string, // 表的引擎
  VERSION: number,
  ROW_FORMAT: string,
  TABLE_ROWS: number,
  AVG_ROW_LENGTH: number,
  DATA_LENGTH: number,
  MAX_DATA_LENGTH: number,
  INDEX_LENGTH: number,
  DATA_FREE: number,
  AUTO_INCREMENT: null,
  CREATE_TIME: string,
  UPDATE_TIME: null,
  CHECK_TIME: null,
  TABLE_COLLATION: string,
  CHECKSUM: null,
  CREATE_OPTIONS: string,
  /**
   * @description 表的注释 也常用于表的中文名
   */
  TABLE_COMMENT: string,
}


