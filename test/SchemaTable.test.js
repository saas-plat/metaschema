const {
  BaseData,
  MetaEntity,
  EntityCache,
  Repository
} = require('../lib');
const {
  expect
} = require('chai');

describe('查询对象定义', () => {

  it('元数据定义查询对象，支持description等', async () => {

    const TestModel = BaseTable( 'TestModel', {
      "id": "string",
      "Code": "string",
      "Str1": {
        type: 'string',
        description: '这是一个字符串'
      },
      "Date": "date",
      "Value": {
        type: 'number',
      },
      "Bool1": 'boolean', // 布尔
      "Ref": 'mixed',
      "Obj1": { // 对象类型
        "Code": "string",
        "Name": "string"
      },
      'Details': [{ // 子表
        "Value": "number",
        "REF2": {
          "id": "string",
          "Code": "string",
          "Name": "string"
        }
      }]
    }, null, {
      description: '测试Model'
    });
    //const  {name, description, fields} = TestMode.schema.paths
    expect(TestModel.schema.path('Str1').options.description).to.be.eq('这是一个字符串');
    //console.log({name, description, fields})

  });

})
