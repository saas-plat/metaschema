# metaschema

一种用 javascript 语言来定义元数据的模式
单据元数据是一种技术无关的业务模型，只对业务模型、行为和规则进行描述，
运行时元数据会被编译/解释成技术平台对象执行。

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

定义一个基础档案

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
  // ------------ actions -----------------
  customAction1: async (data) => {
    ...
  }
});

const SaveCommand = Command('save', {
  send: 'Save'
});
const DeleteCommand = Command('delete', {});

const EditView = Template('EditView', {
  type: 'view',
  items: [
    {
      type: 'toolbar',
      items: [
        {          
          name: 'save',
          type: 'button',
          icon: 'save',
          style: 'icon',
          onClick: SaveCommand,
        },
        {
          name: 'delete',
          type: 'button',
          icon: 'delete',
          style: 'icon',
          onClick: 'delete',
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

export default Bill('BasicArchive',  {
  templates: [EditView],
  entities:  [BankAccount],
  commands:  [SaveCommand, DeleteCommand]
})

```
