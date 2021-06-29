const { generateColumns } = require('../dist/index');
const path = require('path');

const config = {
  connectionConfig: {
    host: 'localhost',
    user: 'root',
    password: '949440946',
  },
  dataBaseNames: ['DYLAN'],
  outputPath: './tests/.output',
  ignoreTableNames: ['database_history'],
  needFormConfig: true,
};

test('create columns from mysql', async () => {
  await generateColumns(config);
});

