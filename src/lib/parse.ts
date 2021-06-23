import * as TableTypes from '../types/table';
import { typeMappings, underscoresToCamelCase } from './utils';

/**
 * @description create columns config
 * @param columns from mysql
 * @returns the parse columns config from template
 */
export function parse(
  columns: TableTypes.ColumnSchema[]
): Partial<TableTypes.Column>[] {
  return columns.map((schema) => {
    let column: Partial<TableTypes.Column> = {};
    column.type = typeMappings[schema.DATA_TYPE];
    column.title = schema.COLUMN_COMMENT;
    column.name = underscoresToCamelCase(schema.COLUMN_NAME);
    column.description = schema.COLUMN_COMMENT;
    return column;
  });
}
