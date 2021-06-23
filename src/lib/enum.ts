import { checkFolder, writeEnums, writePermissions } from './files';
import * as path from 'path';
import { registerHandlebarTemplates } from './template';
/**
 * @description 生成的单个枚举数据结构
 */
interface EnumsItem {
  label: string;
  value: string;
}
/**
 * @description 枚举数据源应符合的结构
 */
export type Enums = Record<
  string,
  Record<string, string> | Record<string, string>[]
>;
interface EnumsTemplateData {
  name: string;
  enums: EnumsItem[];
}

export interface Permission {
  /**
   * @description 中文描述
   */
  label: string;
  /**
   * @description 大写格式化的code
   */
  value: string;
  code: string;
}
/**
 * @description 数组格式下，格式化结构的函数
 * @params { enums } 单项枚举
 */
export type Fomatter = (enums: Record<string, string>) => EnumsItem;

export function generatorEnums({
  enums,
  formatter,
  permissionKey,
}: {
  enums: Enums;
  formatter?: Fomatter;
  /**
   * @description 权限字段的key
   */
  permissionKey?: string;
}): {
  enumsArray: EnumsTemplateData[];
  permissions: Permission[];
} {
  const enumsArray: EnumsTemplateData[] = [];
  let permissions: Permission[];
  const enumsKeys: string[] = Object.keys(enums);
  enumsKeys.forEach((enumsKey) => {
    /**
     * @notice 权限应该是[key,value]对象
     */
    if (enumsKey === permissionKey) {
      permissions = Object.entries(enums[enumsKey]).map((enumsItem) => ({
        label: enumsItem[1],
        value: codeSplitTransfer(enumsItem[0]).toUpperCase(),
        code: enumsItem[0],
      }));
      return;
    }
    /**
     * @notice sometime wo create enums as a array
     */
    if (Array.isArray(enums[enumsKey])) {
      const formatterFn =
        formatter ||
        function (enums) {
          return { label: enums.label, value: enums.value.toUpperCase() };
        };
      enumsArray.push({
        name: addEnumTail(enumsKey),
        // @ts-ignore
        enums: enums[enumsKey].map((enumsItem) => formatterFn(enumsItem)),
      });
    } else {
      enumsArray.push({
        name: addEnumTail(enumsKey),
        enums: Object.entries(enums[enumsKey]).map((enumsItem) => ({
          label: enumsItem[1],
          value: enumsItem[0].toUpperCase(),
        })),
      });
    }
  });
  return {
    enumsArray,
    permissions,
  };
}
/**
 * @description add Enum string tail for name
 * @param name string
 * @returns string
 */
export function addEnumTail(name: string): string {
  return name.endsWith('Enum') ? name : name + 'Enum';
}

/**
 * @description 处理权限码中的分割标志: . - -> 变成下划线
 */
export function codeSplitTransfer(code: string) {
  return code.replace(/(\:|\,|\.|\-|->)/g, '_');
}

interface GenerateEnums {
  enums: Enums;
  outputPath: string;
  formatterFn?: Fomatter;
  permissionKey?: string;
}

/**
 * @description 自动化生成枚举
 * @param enums
 * @param outputPath
 */
export async function generateEnums({
  enums,
  outputPath,
  formatterFn,
  permissionKey,
}: GenerateEnums) {
  const folder = path.resolve(process.cwd(), outputPath);
  await checkFolder(folder);
  const { enumsArray, permissions } = generatorEnums({
    enums,
    formatter: formatterFn,
    permissionKey,
  });
  const templates = registerHandlebarTemplates();
  await Promise.all([
    writeEnums(folder, enumsArray, templates),
    permissions
      ? writePermissions(permissions, folder, templates)
      : Promise.resolve(),
  ]);
}
