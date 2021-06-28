# sandfish

这是一个根据`mysql`数据库自动生成 antd 的表哥列配置、表单配置以及一个枚举自动化创建文件的脚本

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
const { generateEnums, generateColumns } = require('sandfish');
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
generateEnums({
  // 字典数据
  enums: yourEnumsData,
  outputPath: output,
  // 格式化字典格式
  formatterFn: (enumsItem) => {
    // do something
    return {
      label: someLabel,
      value: someValue,
    };
  },
  // 权限
  permissionKey: 'permissionKey'
);
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

### Enum & Permission

枚举（字典）这部分主要为了代码的可读性维护性，我们必须在前后端维护同一份数据，可能格式略有出入。每次接口更新前端也需要手动
维护，为了解决这个痛点。我们增加了枚举模板的生成。
枚举的定义，我们认为枚举应该符合如下结构

```typescript
// Object Type
Record < string, string >
    // SeasonEnum
const SeasonEnum =   {
      SPRING: '春天',
      SUMMER: '夏天',
      AUTUMN: '秋天',
      WINTER: '冬天',
    };

// Array Type
Record <string, string>[]
const SeasonEnumArray = [
  {
    label: '春天',
    value: 'SPRING'
  }
]

```

对于数组格式我们暴露了一个转换方法生成`{label, value}`的结构。
因为业务接口不一致的问题，我们不提供对外获取枚举数据的请求方法，需要使用的时候提供枚举数据
