// 对过程进行合并的数据对象
module.exports = {
  ...require('./BaseTable'),
  name: 'UnionTable',
  fields: {
    ...require('./BaseTable').fields,
  }
}
