module.exports = {
  ...require('./BaseEntity'),
  fields: {
    ...require('./BaseEntity').fields,
    // 基本字段
    name: 'string',
    code: 'string',

    // 审核信息
    auditedBy: 'string',
    // 审核日期
    auditedAt: 'date',
  }

}
