// 将层级数据存储时多增加树检索字段，比如层级和深度等字段
module.exports = {
  ...require('./DataTable'),
  name: 'TreeTable',
  fields: {
    ...require('./DataTable').fields,
    // 父实体的id
    pid: 'string',
  }

}
