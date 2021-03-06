// 对明细进行汇总的数据对象
module.exports = {
  ...require('./BaseTable'),
  name: 'SumTable',
  fields: {
    ...require('./BaseTable').fields,
    // 实体的id
    id: 'string',
    // 明细行的id
    detailId: 'string',
  }
}
