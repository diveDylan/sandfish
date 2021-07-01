# sandfish

这是一个根据`mysql`数据库自动生成 antd 的表格列配置、表单配置以及一个枚举自动化创建文件的脚本

> 字典和权限脚本已经单独拆开: [enum-maker](https://github.com/diveDylan/enum-maker)

<img src="https://img.shields.io/travis/com/diveDylan/sandfish?style=plastic"/>
<img src="https://img.shields.io/codecov/c/github/diveDylan/sandfish?style=plastic"/>

### Install

```bash
npm install sandfish
## or
yarn add sandfish

```

### Usage

> 我们认为用数字命名枚举是不合法且毫无可读性可言的行为，会使系统陷入迭代维护困境。插件会自动为你过滤用数字命名的枚举，

> 如果提示 `Cannot find module 'mysql'`，请安装一下该依赖，因为这个库引用了 `readable-stream` 还有一个暂未关闭的[Circular dependencies](https://github.com/nodejs/readable-stream/issues/348#)，暂时没有将该包打包进去

```js
const { generateColumns } = require('sandfish');
const config = {
  connectionConfig: {
    host: 'localhost',
    user: 'root',
    password: '949440946',
  },
  dataBaseNames: ['DYLAN'], // 数据库名字
  outputPath: './tests/.output', // 输出目录
  ignoreTableNames: ['database_history'], // 不生成表格表单配置的黑名单
  needFormConfig: true, // 是否需要生成表单配置， 默认关闭
};
generateColumns(config);
```

### Columns

在日常表格开发中，我们经常需要根据数据库的列配置书写本地表格的列配置，然后传入我们的`antd/table`组件

```ts
// code examples
/**
 * @description 用户名称
 */
export const username: ColumnType<string> = {
  title: '用户名称',
  dataIndex: 'username',
};
```

### Form

关于表单我们先同步一个概念，表单组件颗粒的定义，如下`UserFormItem`就是一个表单组件颗粒

```typescript
const UserFormItem = (
  <Item name="user" label="用户名称" {...itemProps}>
    <ActionInputComponents>
  </Item>
)

```

如果选用组件开发，颗粒的属性`[name, label]`都可以复用，所以我们会自动生成这部分复用`json`，这时候可能复用率还不够明显。
如果你是用`formily`，这个配置在`schema json`的复用率会有明显的提升

```typescript
/**
 * @description 用户名称
 */
export const usernameFormConfig: FormConfig = {
  label: '用户名称',
  name: 'username',
};
```
