# metaschema
一种用javascript语言来定义元数据的模式

## 标准的模型

**业务实体:**
- Entity  
- BaseData  
- CompositeData
- CategoryTree  
- CategoryData
- LevelData

**查询对象:**
- Table  
- DataTable
- SumTable  
- TreeTable  
- UnionTable

**视图模型:**
- ViewModel  
- FormModel  
- FormListModel
- TreeListModel
- CardModel  

UI模板:
View

业务规则:  
Rule

基于标准模型定义一个业务对象
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
    ...
  }
})

```


## 自定义行为定义
this指向模型实例
```js
action(...args){
  ...
}
```

## 自定义校验定义
接收5个参数，分别是规则定义，待验证值，数据源，选项，上下文，this指向模型实例
返回false校验失败
```js
validator(rule, value, source, options, context){
  return true
}
```

## schemas是可以扩展的

需要定义schema{name, types, syskeys, fields}
```js
const NewModel1 = () => require('./schemas/NewModel1');
```

封装Model的定义函数
```js
NewModel1 = (name, fields) => {
  return new Model(name, Schema.create(NewModel1(), fields));
}
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
