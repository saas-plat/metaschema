const {
  expect
} = require('chai');
const {
  BaseData
} = require('../lib');

describe('业务实体定义', () => {

  it('元数据定义实体对象', async () => {

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

    console.log(TestObj)
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
    console.log(MappingObj.mappings).to.be.eql([

    ])
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

    expect(TestSchemaActionObj.actions).to.be.eql([
      'schemaAction1', 'schemaAction2', 'schemaAction3'
    ])
  })


})
