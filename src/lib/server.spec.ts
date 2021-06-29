// @ts-nocheck
import {
  connect,
  createConnection,
  queryAllTableColumnsSchema,
  findTablesSchema,
  findColumnsSchema,
  generateColumns,
} from './server';
import { parse } from './parse';
import * as path from 'path';
import { writeTables, checkFolder, writeEnums } from './files';
jest.mock('./parse', () => {
  return {
    __esModule: true,
    parse: jest.fn().mockReturnValue([]),
  };
});
jest.mock('./files', () => {
  return {
    __esModule: true,
    writeTables: jest.fn().mockResolvedValue(),
    checkFolder: jest.fn(),
  };
});
jest.mock('mysql', () => {
  return {
    __esModule: true,
    createConnection: jest.fn().mockReturnValue({
      connect: jest.fn().mockImplementation((fn) => {
        fn();
      }),
      end: () => { },
      query: jest.fn().mockImplementation((sql, fn) => {
        fn(null, [
          {
            TABLE_SCHEMA: 'DYLAN',
            TABLE_NAME: 'USER',
            TABLE_COMMENT: '用户表',
            tableDescription: '用户表',
            tableName: 'USER',
          },
        ]);
      }),
      config: {
        host: 'localhost',
      },
    }),
  };
});

const config = {
  host: 'localhost',
  user: 'root',
  password: '949440946',
  dataBaseName: 'DYLAN',
  outputPath: './test/output',
  ignoreTableNames: ['database_history'],
};

let connection, connected;
// create connection
beforeAll(() => {
  connection = createConnection(config);
});
// close connection
afterAll(() => {
  if (connected) connection.end();
});

test('createConnection should return connection', () => {
  expect(connection).toBeDefined();
});

test('excute connect function should resolved ', async () => {
  try {
    connected = await connect(connection);
    expect(connected).toBeTruthy();
  } catch (err) {
    expect(err).toBeUndefined();
  }
});

test('excute connect function should reject when error is exist', async () => {
  const res = await connect({
    connect: jest.fn().mockImplementation((cb) => cb('reject')),
  });
  expect(res).toBeFalsy();
});

test('find tables schema in the database', async () => {
  if (!connected) return;
  const tables = await findTablesSchema(
    connection,
    config.dataBaseName,
    config.ignoreTableNames
  );
  expect(tables[0]).toHaveProperty('TABLE_SCHEMA', config.dataBaseName);
  expect(tables[0]).toHaveProperty('TABLE_NAME', 'USER');
  expect(tables[0]).toHaveProperty('TABLE_COMMENT', '用户表');
});

test('findColumnsSchema should output the columns schema', async () => {
  if (!connected) return;
  const tables = await findTablesSchema(
    connection,
    config.dataBaseName,
    config.ignoreTableNames
  );
  const columns = await findColumnsSchema(
    connection,
    config.dataBaseName,
    tables[0]
  );

  expect(columns).toMatchObject({
    columns: [],
    tableDescription: '用户表',
    tableName: 'USER',
  });
  expect(parse).toBeCalled();
});

test("queryAllTableColumnsSchema should get all tables's columns", async () => {
  if (!connected) return;
  const tables = await findTablesSchema(
    connection,
    config.dataBaseName,
    config.ignoreTableNames
  );
  const columns = await queryAllTableColumnsSchema(
    connection,
    config.dataBaseName,
    tables
  );
  expect(columns[0]).toHaveProperty('tableName', 'USER');
  expect(columns[0]).toHaveProperty('tableDescription', '用户表');
});

test('generateColumns will call checkFolder, writeTables', async () => {
  await generateColumns({
    ...config,
    dataBaseNames: [config.dataBaseName],
  });
  expect(checkFolder).toBeCalledWith(
    path.resolve(process.cwd(), config.outputPath)
  );
  expect(writeTables).toBeCalled();
});
