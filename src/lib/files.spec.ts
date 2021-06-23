// @ts-nocheck
import * as files from './files';
import { Templates } from './template';
import * as path from 'path';
import fs from 'fs-extra';

jest.mock('fs-extra', () => {
  return {
    _isEsModule: true,
    writeFileSync: jest.fn(() => {}),
    pathExistsSync: jest.fn().mockReturnValue(true),
    removeSync: jest.fn(),
    mkdirsSync: jest.fn(),
  };
});
let templates: Templates;
beforeAll(() => {
  templates = {
    column: () => 'columns',
    form: () => 'form',
    utils: () => 'utils',
    enums: () => 'enums',
    permission: () => 'permission',
  };
});
const table = {
  tableName: 'test',
  columns: [
    {
      name: 'name',
      title: '姓名',
      type: 'string',
      /**
       * @description 列的描述
       */
      description: '用户的姓名',
    },
  ],
  tableDescription: '用户名',
};
const output = path.resolve(__dirname);

test('writeColumns should create columns files', async () => {
  await files.writeColumns(table, output, templates, 'database');
  expect(fs.writeFileSync).toBeCalledTimes(1);
  expect(fs.writeFileSync).toBeCalledWith(
    output + '/database/columns/' + table.tableName + '.ts',
    'columns'
  );
});
test('writeFormConfigs should create forms files', async () => {
  await files.writeFormConfigs(table, output, templates, 'database');
  expect(fs.writeFileSync).toBeCalled();
});

test('writeTables should create files', async () => {
  const res = await files.writeTables([table], output, templates, 'database');
  expect(res).toBeUndefined();
});

test('checkout lib folder should exist', async () => {
  await files.checkFolder('../lib');
  expect(fs.pathExistsSync).toReturnWith(true);
  expect(fs.removeSync).toBeCalledTimes(1);
});

test('writeEnums should write file', async () => {
  await files.writeEnums('../lib', [], templates);
  expect(fs.writeFileSync).toBeCalled();
});
test('writePermissions should write files', async () => {
  await files.writePermissions([], '../lib', templates);
  expect(fs.writeFileSync).toBeCalled();
});
