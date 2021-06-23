import {
  typeMappings,
  renderFnMappings,
  IGNORE_TABLE_NAME,
  underscoresToCamelCase
} from './utils'

test('typeMappings config property', () => {
  expect(typeMappings).toHaveProperty('varchar', 'string')
  expect(typeMappings).toHaveProperty('char', 'string')
  expect(typeMappings).toHaveProperty('int', 'number')
  expect(typeMappings).toHaveProperty('tinyint', 'number')
  expect(typeMappings).toHaveProperty('time', 'string | number')
})

test('renderFnMappings mapping check', () => {
  expect(renderFnMappings).toHaveProperty('DATE', 'formatTime')
})

test('IGNORE_TABLE_NAME white list config', () => {
  expect(IGNORE_TABLE_NAME).toContain('database_history')
})

test('format table name to came case', () => {
  expect(underscoresToCamelCase('user_info')).toBe('userInfo')
  expect(underscoresToCamelCase('user')).toBe('user')
})
