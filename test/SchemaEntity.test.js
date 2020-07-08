const {
  expect
} = require('chai');
const {
  Entity,
  BaseData,
  CompositeData,
  CategoryTree,
  CategoryData,
  LevelData
} = require('../lib');

describe('业务实体定义', () => {

  it('用元数据定义实体模型', async () => {

    const TestObj = BaseData('TestObj', {
      "Code": {
        type: "string",
        required: true, // 必录
        min: 1,
        max: 10,
        unique: true
      }, // 字符串
      "Str1": {
        type: 'string',
        length: 2,
        pattern: '[a-z]*'
      },
      "Date": "date",
      "Value": {
        type: 'number', // 数值
        enum: [100, 200]
      },
      "Bool1": 'bool', // 布尔
      "Ref": 'Persion', // 引用员工档案
      "Ref1": { // 引用 另一种写法
        type: 'reference',
        reference: 'TestReference1'
      },
      "Obj1": { // 对象类型
        "Code": "string",
        "Name": "string"
      },
      'Array1': [{ // 对象数组
        "Value": "number",
        "REF2": 'TestReference2' // 数组中的引用
      }]
    });

    //console.log(JSON.stringify(TestObj))
    expect(JSON.parse(JSON.stringify(TestObj))).to.be.eql({
      "name": "TestObj",
      "schema": {
        "type": "BaseData",
        "fields": [{
          "key": "Code",
          "type": "string",
          "rules": {
            "type": "string",
            "required": true,
            "min": 1,
            "max": 10,
            "unique": true
          }
        }, {
          "key": "Str1",
          "type": "string",
          "rules": {
            "type": "string",
            "length": 2,
            "pattern": "[a-z]*"
          }
        }, {
          "key": "Date",
          "type": "date"
        }, {
          "key": "Value",
          "type": "number",
          "rules": {
            "type": "number",
            "enum": [100, 200]
          }
        }, {
          "key": "Bool1",
          "type": "boolean"
        }, {
          "key": "Ref",
          "type": "reference",
          "src": "Persion"
        }, {
          "key": "Ref1",
          "type": "reference",
          "rules": {
            "type": "reference",
            "reference": "TestReference1"
          }
        }, {
          "key": "Obj1",
          "type": "object",
          "fields": [{
            "key": "Code",
            "type": "string"
          }, {
            "key": "Name",
            "type": "string"
          }]
        }, {
          "key": "Array1",
          "type": "array",
          "subtype": "object",
          "fields": [{
            "key": "Value",
            "type": "number"
          }, {
            "key": "REF2",
            "type": "reference",
            "src": "TestReference2"
          }]
        }, {
          "key": "id",
          "type": "string"
        }, {
          "key": "status",
          "type": "string",
          "defValue": "invalid",
          "rules": {
            "type": "string"
          }
        }, {
          "key": "createBy",
          "type": "string"
        }, {
          "key": "createAt",
          "type": "date"
        }, {
          "key": "updateBy",
          "type": "string"
        }, {
          "key": "updateAt",
          "type": "date"
        }, {
          "key": "deleteBy",
          "type": "string"
        }, {
          "key": "deleteAt",
          "type": "date"
        }, {
          "key": "ts",
          "type": "string"
        }, {
          "key": "name",
          "type": "string"
        }, {
          "key": "code",
          "type": "string"
        }, {
          "key": "auditedBy",
          "type": "string"
        }, {
          "key": "auditedAt",
          "type": "date"
        }],
        "conflicts": [],
        "mappings": {},
        "references": {
          "Ref": "Persion",
          "Array1[].REF2": "TestReference2"
        },
        "actions": [],
        "syskeys": ["eventsToEmit", "newEvents", "replaying", "_events", "_eventsCount", "_maxListeners", "snapshotVersion", "timestamp", "version", "_ns", "_id"]
      }
    })
  });

  it('实体支持字段名称映射，但是也不影响基类的写法', async () => {

    const MappingObj = BaseData('MappingObj1', {
      "ID": {
        type: 'string',
        mapping: 'id'
      },
      "times": {
        type: 'string',
        mapping: 'ts'
      },
      "Code": "string"
    });
    expect(MappingObj.schema.mappings).to.be.eql({
      "id": "ID",
      "ts": "times"
    })
  })

  it('可以通过schema定义一个自定义行为', async () => {
    const TestSchemaActionObj = BaseData('TestSchemaActionObj', {
      "Code": "string",
      // 简写
      schemaAction1: (eventData, params) => {
        eventData.Code = params.otherKey1;
        console.log(eventData)
      },
      // schema类型定义
      schemaAction2: {
        type: 'function',
        handle: function (eventData, params) {
          eventData.Code = params.otherKey2;
        }
      },
      // 字符串数据定义
      schemaAction3: {
        type: 'function',
        handle: ['', 'eventData.Code = params.otherKey3']
      }
    });

    expect(TestSchemaActionObj.schema.actions.map(it => it.key)).to.deep.include.members([
      'schemaAction1', 'schemaAction2', 'schemaAction3'
    ])
  })

  it('可以通过schema定义一个自定义校验行为', async () => {
    const TestSchemaValidatorObj = BaseData('TestSchemaValidatorObj', {
      "Field1": {
        type: "string",
        // 简写
        validator: (rule, value) => {
          console.log('validator1')
        },
      },
      "Field2": {
        type: "string",
        // schema类型定义
        validator: `console.log('validator2') `
      },
      "Field3": {
        type: "string",
        // 字符串数据定义
        validator: [`console.log('validator3')`, 'value === "3"']
      }
    });
    //console.log(TestSchemaValidatorObj.schema.fields)
    expect(TestSchemaValidatorObj.schema.fields
      .filter(it => ['Field1', 'Field2', 'Field3'].indexOf(it.key) > -1)
      .map(it => it.rules.validator.toString())).to.deep.include.members([
       "(rule, value) => {\n          console.log('validator1')\n        }",
      "function anonymous(rule,value,source,options,context\n) {\nreturn console.log('validator2') \n}",
      "function anonymous(rule,value,source,options,context\n) {\nconsole.log('validator3')\nreturn value === \"3\"\n}"
    ])
  })

  it('更多的类型', async () => {
    Entity('BaseEntity1', {
      "Code": "string"
    });
    CompositeData('BaseEntity2', {
      "Code": "string"
    });
    CategoryTree('EntityTree', {
      "Code": "string",
      parent: "EntityTree",
      childs: ["EntityTree"],
      details: ['BaseEntity3'],
    });
    CategoryData('BaseEntity3', {
      "Code": "string",
      category: 'EntityTree'
    });
    LevelData('BaseEntity4', {
      "Code": "string",
      parent: "BaseEntity4",
      childs: ["BaseEntity4"],
    });
  })

  it('映射字段,方便获取系统字段', async () => {
    const Tree = CategoryTree('EntityTree2', {
      "Code": "string",
      aaa: {
        mapping: 'parent',
        type: "EntityTree"
      },
      childs: ["EntityTree"],
      details: ['BaseEntity3'],
    });

    const obj = {};
    Tree.schema.createMappingProps(obj)
    expect('parent' in obj).to.be.true;
  });
})
