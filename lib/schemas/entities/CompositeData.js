module.exports = {
  name: 'CompositeData',
  ...require('./BaseEntity'),
  fields: {
    ...require('./BaseEntity').fields,

    // 明细表必须提供
    details: {
      type: 'array',
      fields: {
        id: 'string',
        // 子表不需要ts,每次都是按照实体操作,每次实体的ts都会改变
        // // 时间戳,用来控制数据有效性,每次修改时间戳都会改变
        // ts: 'string'
      }
    },

    attachments: [{
      fileId: 'string',
      name: 'string',
      uploadAt: 'date',
      uploadBy: 'string'
    }],

    // 审核信息
    auditedBy: 'string',
    // 审核日期
    auditedAt: 'date',

    // 转换的单ID
    toId: 'string',
    // 来源单ID,从其他单保存过程生成
    srcId: 'string'
  }
}
