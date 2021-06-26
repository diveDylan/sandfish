/**
 * @description how it works
 * *1. get a config, includes connect config, database
 * *2. query database all tables
 * *3. query tables columns schema
 */
import * as mysql from 'mysql';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { parse } from './parse';
import { underscoresToCamelCase } from './utils';
import * as TableTypes from '../types/table';
import { writeTables, checkFolder, writeFormConfigs } from './files';
import { registerHandlebarTemplates } from './template';
interface ConnectionConfig {
  host: string;
  port?: string | number;
  user: string;
  password: string;
}

export function createConnection(connectionConfig: ConnectionConfig) {
  const connection = mysql.createConnection(connectionConfig);
  return connection;
}

/**
 * @description connect mysql server
 */
export function connect(connection): Promise<boolean> {
  return new Promise((resolve) => {
    const spinner = ora('connect mysql server...').start();
    spinner.color = 'blue';
    connection.connect((err) => {
      if (err) {
        spinner.fail();
        resolve(false);
        console.log(chalk.red(err));
        return;
      }
      spinner.succeed();
      console.log(
        chalk.greenBright(`connect to ${connection.config.host} succeed`)
      );
      resolve(true);
    });
  });
}

/**
 * @description find all tables info schema
 */
export function findTablesSchema(
  connection,
  dataBaseName: string,
  IGNORE_TABLE_NAME: string[]
): Promise<TableTypes.MysqlTable[]> {
  const spinner = ora('query tables...').start();
  spinner.color = 'yellow';
  return new Promise((resolve, reject) => {
    const sql = `select * from information_schema.TABLES where TABLE_SCHEMA = '${dataBaseName}'`;
    connection.query(sql, function (error, tables: TableTypes.MysqlTable[]) {
      if (error) {
        spinner.fail();
        reject(error);
        return;
      }
      spinner.succeed();
      resolve(
        tables.filter((table) => !IGNORE_TABLE_NAME.includes(table.TABLE_NAME))
      );
    });
  });
}

/**
 * @description query columns schema by table name
 */
export function findColumnsSchema(
  connection,
  dataBaseName: string,
  table: TableTypes.MysqlTable
): Promise<TableTypes.Table> {
  const spinner = ora('query columns...').start();
  spinner.color = 'yellow';
  return new Promise((resolve, reject) => {
    const sql = `select * from information_schema.COLUMNS where TABLE_SCHEMA = '${dataBaseName}' and TABLE_NAME='${table.TABLE_NAME}'`;
    connection.query(sql, (error, columns: TableTypes.ColumnSchema[]) => {
      if (error) {
        spinner.fail();
        reject(error);
        return;
      }
      spinner.succeed();
      resolve({
        tableName: underscoresToCamelCase(table.TABLE_NAME),
        columns: parse(columns),
        tableDescription: table.TABLE_COMMENT,
      });
    });
  });
}

/**
 * @description query all table columns schema
 */
export async function queryAllTableColumnsSchema(
  connection: string,
  dataBaseName: string,
  tables: TableTypes.MysqlTable[]
) {
  const columns: TableTypes.Table[] = await Promise.all(
    tables.map((table) => findColumnsSchema(connection, dataBaseName, table))
  );
  return columns;
}

export interface Config {
  /**
   * @description 数据库的名字
   */
  dataBaseNames: string[];
  formatTimeType?: string;
  /**
   * @description
   */
  needFormConfig?: boolean;
  /**
   * @description 输出文件的目录
   */
  outputPath: string;
  /**
   * @description 忽略的表名字
   */
  ignoreTableNames?: string | string[];
  connectionConfig: ConnectionConfig
}


/**
 * @description run a mysql connection and query database
 */
export async function generateColumns(config: Config) {
  const {
    connectionConfig,
    outputPath,
    dataBaseNames,
    needFormConfig,
    ignoreTableNames
  } = config
  let connection = await createConnection(connectionConfig);
  let connected = await connect(connection);
  const folder = path.resolve(process.cwd(), outputPath);
  if (!connected) return;
  await checkFolder(folder);
  await Promise.all(
    dataBaseNames.map(async (databaseName) => {
      const databaseFolder =
        folder + '/' + underscoresToCamelCase(databaseName);
      await checkFolder(databaseFolder);
      await Promise.all([
        checkFolder(databaseFolder + '/columns'),
        needFormConfig
          ? checkFolder(databaseFolder + '/formConfigs')
          : Promise.resolve(),
      ]);
    })
  );
  let templates = registerHandlebarTemplates();
  // 根据单个database 写列配置
  async function writeDataBaseColumns(dataBaseName) {
    let database = await findTablesSchema(
      connection,
      dataBaseName,
      [].concat(ignoreTableNames)
    );
    let tables = await queryAllTableColumnsSchema(
      connection,
      dataBaseName,
      database
    );
    // TODO render tables
    await writeTables(
      tables,
      folder,
      templates,
      underscoresToCamelCase(dataBaseName)
    );
    if (needFormConfig) {
      // TODO write formConfig
      await Promise.all(
        tables.map((table) =>
          writeFormConfigs(
            table,
            folder,
            templates,
            underscoresToCamelCase(dataBaseName)
          )
        )
      );
    }
  }
  try {
    await Promise.all(
      config.dataBaseNames.map((dataBaseName) =>
        writeDataBaseColumns(dataBaseName)
      )
    );
  } finally {
    connection.end();
  }
}
