# metaschema

一种用 javascript 语言来定义开发模型架构

开发模型提供了更灵活、更专业的配置，还支持通过 js 编写扩展的能力，
现在支持实体、查询、视图等多层的定义和规则扩展能力。

## 模型

### 实体:

- Entity
- BaseData
- CompositeData
- CategoryTree
- CategoryData
- LevelData
- Enum

### 查询:

- Table
- DataTable
- SumTable
- TreeTable
- UnionTable

## 模板

### 视图:

### 模型:

- ViewModel
- FormModel
- FormListModel
- TreeListModel
- CardModel

## 规则:

### Rule

## 定时任务: 

## 基于标准模型定义一个业务对象

```js
import {
  BaseData,
} from '@saas-plat/metaschema';

export default BaseData('BankAccount',  {
  Code: {
    mapping: 'code',
    validator: (rule, value)=>{
      return !!value;
    }
  },
  Name: String,
  NewBalance: Number,
  // ------------ actions -----------------
  customAction1: async (data) => {
    const entity = this;
    ...
  }
})

```

### 自定义行为

this 指向模型实例

```js
action(...args){
  const entity = this;
}
```

### 自定义校验定义

接收 5 个参数，分别是规则定义，待验证值，数据源，选项，上下文，this 指向模型实例
返回 false 校验失败

```js
validator(rule, value, source, options, context){
  return true
}
```

## 高级
schemas 是可以扩展的

需要定义 schema{name, types, syskeys, fields}

```js
const NewModel1 = () => require('./schemas/NewModel1');
```

封装 Model 的定义函数

```js
NewModel1 = (name, fields) => {
  return new Model(name, Schema.create(NewModel1(), fields));
};
```

开发者定义新模型

```js
import {
  NewModel1,
} from 'otherschema';

export default NewModel1('xxxx',  {
  ...
})
```
