# metaschema

一种用 javascript 语言来定义元数据的模式  
单据元数据是一种业务模型描述语言，只对业务模型、行为和规则进行描述，
元数据会转换成多端协议格式返回给运行平台，运行平台会根据协议编译/解释成技术平台对象执行。

## 元数据类型

| 类型     | 名称 | 说明                                             |
| -------- | ---- | ------------------------------------------------ |
| Bill     | 单据 | 元数据根对象，其他模型都包含在一个单据中         |
| Entity   | 实体 | 业务模型定义，包括前后端描述信息                 |
| Query    | 查询 | 数据分析模型，由实体聚合或者转换而来             |
| Template | 模板 | 显示视图进行定义的模型                           |
| Filter   | 查询 | 对数据过滤器进行定义                             |
| Toolbar  | 行为 | 对功能按钮定义，点击执行命令                     |
| Schedule | 任务 | 定时触发的任务，执行时会调用命令                 |
| Command  | 命令 | 命令定义，执行时会触发规则                       |
| Rule     | 规则 | 业务对象的改变、按钮、任务、命令执行都会触发规则 |

## Bill

## Entity

## Query

## Template

## Filter

## Toolbar

## Schedule

## Command

## Rule

## 定义一个单据

```js
import {
  Bill,
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
          bind: 'save',
        },
        {
          type: 'button',
          icon: 'delete',
          style: 'icon',
          bind: DeleteCommand,
        },
      ],
    },
    {
      type: 'view',
      items: [
        {
          bind: 'Code',
        },
        {
          bind: 'Name',
        },
        {
          bind: 'NewBalance',
        },
      ],
    },
  ],
});

const SavingRule = Rule('saving rule', {
  e: 'Action',
  'condition': e => e.name == 'saveClick'  // 发生在前端业务规则
}, (facts) => {
  ...
})

const SaveRule = Rule('save rule', {
  e: 'Command',
  'condition': e => e.name == 'save'  // 发生在后端业务规则
}, (facts) => {
  ...
})

const SavedRule = Rule('saved rule', {
  e: 'Event',
  'condition': e => e.name == 'saved'  // 发生在后端业务事件
}, (facts) => {
  ...
})

export default Bill('BankAccountArchive',  {
  type: 'BasicArchive',
  templates: [ EditView ],
  entities:  [ BankAccount ],
  commands:  [ SaveCommand, DeleteCommand ],
  rules: [ SavingRule, SaveRule, SavedRule ]
})

```

## 定义打印模板

## 定义一个报表
