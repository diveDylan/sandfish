import fs from 'fs-extra';
import { Templates } from './template';
import * as TableTypes from '../types/table';
import { Permission } from './enum';

/**
 * @description write columns by table
 */
export async function writeColumns(
  table: TableTypes.Table,
  outputPath: string,
  templates: Templates,
  dataBaseName: string
): Promise<void> {
  const columnsData = templates.column(table);
  const fileName =
    outputPath + '/' + dataBaseName + '/columns/' + table.tableName + '.ts';
  await fs.writeFileSync(fileName, columnsData);
}

/**
 * @description write tables
 */
export async function writeTables(
  tables: TableTypes.Table[],
  outputPath: string,
  templates: Templates,
  dataBaseName: string
) {
  await Promise.all(
    tables.map((table) =>
      writeColumns(table, outputPath, templates, dataBaseName)
    )
  );
}
/**
 * @description if folder is exist, remove and mkdir a new folder
 */
export async function checkFolder(folder: string) {
  const isExists = await fs.pathExistsSync(folder);
  if (isExists) {
    await fs.removeSync(folder);
  }
  await fs.mkdirsSync(folder);
}

/**
 * @description write enums files
 */
export async function writeEnums(folder, enums, templates) {
  const enumsData = templates.enums({ enums });
  await fs.writeFileSync(folder + '/enum.ts', enumsData);
}

/**
 * @description write form config
 */
export async function writeFormConfigs(
  form: TableTypes.Table,
  outputPath: string,
  templates: Templates,
  dataBaseName: string
): Promise<void> {
  const formConfigs = templates.form(form);
  const fileName =
    outputPath + '/' + dataBaseName + '/formConfigs/' + form.tableName + '.ts';
  await fs.writeFileSync(fileName, formConfigs);
}
/**
 * @description write permissions
 */
export async function writePermissions(
  permissions: Permission[],
  outputPath: string,
  templates: Templates
): Promise<void> {
  const permissionTemplate = templates.permission({ permissions });
  const fileName = outputPath + '/permissions.ts';
  await fs.writeFileSync(fileName, permissionTemplate);
}
