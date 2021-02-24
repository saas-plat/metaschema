 // 基本的数据查询对象，对业务实体数据进行记录生成一个数据列表
 module.exports = {
   ...require('./BaseTable'),
   name: 'DataTable',
   fields: {
     ...require('./BaseTable').fields,

     // 实体Id，这个id默认和entity的id同名
     id: 'string',
     name: 'string',
     code: 'string',
     ts: 'string',
   }
 }
