exports.name = 'Entity';

exports.types = [
  'string', 'object', 'array', 'number', 'boolean', 'date', 'reference', 'function'
];

exports.syskeys = [
  'eventsToEmit', 'newEvents', 'replaying', '_events', '_eventsCount', '_maxListeners',
  'snapshotVersion', 'timestamp', 'version',
  '_ns', // 命名空间
  '_id' // 为了保护id不能更新
];

exports.fields = {
  id: 'string',

  // 实体状态
  status: {
    type: 'string',
    // 默认无效状态
    defaultValue: 'invalid'
  },

  // 基本信息
  createBy: 'string',
  createAt: 'date',
  updateBy: 'string',
  updateAt: 'date',
  deleteBy: 'string',
  deleteAt: 'date',

  // 时间戳,用来控制数据有效性,每次修改时间戳都会改变
  ts: 'string'
}
