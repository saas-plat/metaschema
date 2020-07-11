const {
  expect
} = require('chai');
const {
  ViewModel
} = require('../lib');

describe('视图模型定义', () => {

  it('可以自定义视图模型', () => {
    // 所有字段，包括实体、过滤、按钮等都是字段
    const VM1 = ViewModel('VM1', {
      code: {
        type: 'SimpleModel',
        fields: {
          lable: {
            type: 'string',
            default: '编码'
          },
          visible: {
            type: 'boolean',
            default: true
          },
          disable: {
            type: 'boolean',
            default: false
          },
          default: {
            type: 'string'
          },
        }
      },
      details: {
        type: 'TableModel',
        fields: {
          code: {
            type: 'SimpleModel',
            fields: {
              lable: {
                type: 'string',
                default: '编码'
              },
              visible: {
                type: 'boolean',
                default: true
              },
              disable: {
                type: 'boolean',
                default: false
              },
              default: {
                type: 'string'
              },
            }
          }
        }
      },
      search: {
        type: 'FilterModel',
        fields: {

        }
      },
      btn1: {
        type: 'SimpleModel',
        fields: {
          text: {
            type: 'string',
            default: '按钮1'
          },
          visible: {
            type: 'boolean',
            default: true
          },
          disable: {
            type: 'boolean',
            default: false
          },
        }
      }
    })

    // console.log(JSON.stringify(VM1.schema.fields))
    expect(JSON.parse(JSON.stringify(VM1.schema.fields))).to.be.eql([{
        "key": "code",
        "type": "SimpleModel",
        "fields": [{
            "key": "lable",
            "type": "string",
            "defValue": "编码",
            "rules": {
              "type": "string"
            }
          },
          {
            "key": "visible",
            "type": "boolean",
            "defValue": true,
            "rules": {
              "type": "boolean"
            }
          },
          {
            "key": "disable",
            "type": "boolean",
            "rules": {
              "type": "boolean"
            }
          },
          {
            "key": "default",
            "type": "string",
            "rules": {
              "type": "string"
            }
          }
        ],
        "rules": {
          "type": "object"
        }
      },
      {
        "key": "details",
        "type": "TableModel",
        "fields": [{
          "key": "code",
          "type": "SimpleModel",
          "fields": [{
              "key": "lable",
              "type": "string",
              "defValue": "编码",
              "rules": {
                "type": "string"
              }
            },
            {
              "key": "visible",
              "type": "boolean",
              "defValue": true,
              "rules": {
                "type": "boolean"
              }
            },
            {
              "key": "disable",
              "type": "boolean",
              "rules": {
                "type": "boolean"
              }
            },
            {
              "key": "default",
              "type": "string",
              "rules": {
                "type": "string"
              }
            }
          ],
          "rules": {
            "type": "object"
          }
        }],
        "rules": {
          "type": "object"
        }
      },
      {
        "key": "search",
        "type": "FilterModel",
        "fields": [],
        "rules": {
          "type": "object"
        }
      },
      {
        "key": "btn1",
        "type": "SimpleModel",
        "fields": [{
            "key": "text",
            "type": "string",
            "defValue": "按钮1",
            "rules": {
              "type": "string"
            }
          },
          {
            "key": "visible",
            "type": "boolean",
            "defValue": true,
            "rules": {
              "type": "boolean"
            }
          },
          {
            "key": "disable",
            "type": "boolean",
            "rules": {
              "type": "boolean"
            }
          }
        ],
        "rules": {
          "type": "object"
        }
      }
    ])
  })
})
