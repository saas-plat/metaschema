const {
  expect
} = require('chai');
const {
  Schema,
  Types
} = require('../lib');
const BaseData = require('../lib/schemas/tables/BaseTable');

describe('模型架构', () => {

  it('支持jsschema的类型系统', () => {
    const s = Schema.create(BaseData, {
      Code: {
        type: String,
        mapping: 'code'
      },
      Name: {
        type: String,
        mapping: 'name'
      },
      NewBalance: Number,
      Other: Types.Mixed,
      // ------------ actions -----------------
      customAction1: {
        type: 'function',
        handle: () => {
          // todo
        }
      }
    });
    // console.log(JSON.stringify(s))
    expect(JSON.parse(JSON.stringify(s))).to.be.eql({
      "type": "BaseTable",
      "fields": [{
        "key": "Code",
        "type": "string",
        "rules": {
          "type": "string"
        },
        "mapping": "code"
      }, {
        "key": "Name",
        "type": "string",
        "rules": {
          "type": "string"
        },
        "mapping": "name"
      }, {
        "key": "NewBalance",
        "type": "number"
      }, {
        "key": "Other",
        "type": "mixed"
      }],
      "actions": [{
        "key": "customAction1",
        "type": "function",
        "rules": {
          "type": "function"
        },
        "arguments": []
      }],
      "conflicts": [],
      "mappings": {
        "code": "Code",
        "name": "Name"
      },
      "references": {},
      "syskeys": ["_id", "_ns"]
    })
  })
})
