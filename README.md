# metaschema

一种用 javascript 语言来定义元数据的模式  
单据元数据是一种业务模型描述语言，只对业务模型、行为和规则进行描述，
元数据会转换成多端协议格式返回给运行平台，运行平台会根据协议编译/解释成技术平台对象执行。

## 元数据类型

| 类型     | 名称 | 说明                                             |
| -------- | ---- | ------------------------------------------------ |
| Entity   | 实体 | 业务模型定义，包括显示和存储描述信息             |
| View     | 视图 | 数据管理视图，由实体筛选而来                     |
| Template | 模板 | 定义业务表单、数据管理、报表、自定义页面等的布局 |
| Rule     | 规则 | 实体的改变、按钮、任务、外部接口都会触发规则     |

## 实体

## 视图

- Filter 查询
  对数据过滤器进行定义
- Plan 方案
  特定的查询方案

## 模板

- Container 容器
  布局容器，可以递归嵌套
- Toolbar 按钮
  自定义一组按钮，点击触发规则的执行
- Command 命令
  按钮执行

## 规则

- Condition 条件
  - Entity
    实体增删改时触发规则
  - Job
    定时触发的任务，执行时会触发一组规则
  - API  
    第三方系统触发执行的规则
- Action 动作
  编排一组业务动作，用来在满足条件时执行

## 定义一个单据

```js
import {
  Entity,
  Template,
  Command,
  Rule
} from '@saas-plat/metaschema';

const BankAccount = Entity('BankAccount', {
  Code: {
    mapping: 'code',
    validator: (rule, value)=>{
      return !!value;
    }
  },
  Name: String,
  NewBalance: Number,
});

const SaveCommand = Command('save', {});
const DeleteCommand = Command('delete', {});

const EditView = Template('View', {
  type: 'view',
  items: [
    {
      type: 'toolbar',
      items: [
        {
          type: 'button',
          icon: 'save',
          style: 'icon',
          onClick: 'save',
        },
        {
          type: 'button',
          icon: 'delete',
          style: 'icon',
          onClick: ()=> DeleteCommand.execute({arg1:'xxxxx}),
        },
      ],
    },
    {
      type: 'view',
      items: [
        {
          field: 'Code',
        },
        {
          field: 'Name',
        },
        {
          field: 'NewBalance',
        },
      ],
    },
  ],
});

const SavingRule = Rule('xxx rule', {
  e: 'Entity',
  'condition': e => e.name == 'xxxx'   
}, (facts) => {
  ...
})

const SaveRule = Rule('xxxx rule', {
  e: 'Job',
  'condition': e => e.name == 'xxxx'   
}, (facts) => {
  ...
})

const SavedRule = Rule('saved rule', {
  e: 'Api',
  'condition': e => e.key == 'xxxx'   
}, (facts) => {
  ...
})

```

## 定义打印模板

## 定义一个报表

## 自定义页面
