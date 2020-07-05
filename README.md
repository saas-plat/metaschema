# metaschema
一种用javascript语言来定义元数据的模式

# 标准的模型
Entity  
BaseData  
CompositeData
CategoryTree  
CategoryData
LevelData

Table  
DataTable
SumTable  
TreeTable  
UnionTable

ViewModel  
FormModel  
FormListModel
TreeListModel
CardModel  

View  
Rule

# schemas是可以扩展的

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

开发者调用
```js
import {
  NewModel1,
} from 'otherschema';

export default NewModel1('xxxx',  {
  ...
})
```
