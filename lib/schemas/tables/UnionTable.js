// 对过程进行合并的数据对象
module.exports = {
  name: 'UnionTable',
  ...require('./BaseTable'),
  fields: {
    ...require('./BaseTable').fields,
  }
}
