const { generateEnums, generateColumns } = require('../dist/index');
const path = require('path');

const config = {
  host: 'localhost',
  user: 'root',
  password: '949440946',
  dataBaseNames: ['DYLAN'],
  outputPath: './tests/.output',
  ignoreTableNames: ['database_history'],
  needFormConfig: true,
};

test('create columns from mysql', async () => {
  await generateColumns(config);
});

test('generate enums', async () => {
  const enums = {
    CheckPeriod: { YEAR: '年度考核', QUARTER: '季度考核' },
    ResourceEnum: {
      'center:pricing:add': '个人中心_客户守价_申请守价组',
      'center:pricing:apply:edit': '个人中心_客户守价_申请修改',
      'center:pricing:delete': '个人中心_客户守价_删除',
    },
  };
  await generateEnums({
    enums,
    outputPath: './tests/.types',
    permissionKey: 'ResourceEnum',
  });
});
