// 数据查询对象基类
exports.name = 'Table';

exports.types = [
  'string', 'object', 'array', 'number', 'boolean', 'date',
  'buffer', 'mixed', 'reference', 'function'
];

exports.syskeys = [
  '_id',
  '_ns'
];

exports.fields = {}
