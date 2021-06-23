

/**
 * @description sql types mapping
 */
export const typeMappings: Record<string, string> = {
  varchar: 'string',
  char: 'string',
  binary: 'string',
  varbinary: 'string',
  blob: 'string',
  text: 'string',
  enum: 'string',
  set: 'string',
  int: 'number',
  integer: 'number',
  smallint: 'number',
  tinyint: 'number',
  mediumint: 'number',
  bigint: 'number',
  bit: 'number',
  float: 'number',
  dec: 'number',
  decimal: 'number',
  double: 'number',
  // 1973-12-30
  date: 'Date',
  // 1973-12-30 15:30:00
  datetime: 'string',
  // HH:MM:SS
  time: 'string | number',
  year: 'string | number',
  timestamp: 'number'
}


/**
 * @description render的函数mapping
 */
export const renderFnMappings: Record<'DATE', string> = {
  /**
   * @description 时间处理函数
   */
  DATE: 'formatTime'
}
/**
 * @description default table name
 */
export const IGNORE_TABLE_NAME: string[] = ['database_history']

/**
 * @description 处理表、列名字下划线为驼峰
 */
export function underscoresToCamelCase(string: string): string {
  if (/\_/.test(string)) {
    return string.split('_').map(
      (str, index) =>
        index === 0
        ? str
        : str.replace(str[0], str[0].toUpperCase())
    ).join('')
  } else {
    return string
  }
}
