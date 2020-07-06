exports.CategoryTree = {
  ...require('./LevelData'),
  name: 'CategoryTree',
  fields: {
    ...require('./LevelData').fields,
    // 引用的明细数据，需要设置mapping
    details: {
      type: 'array',
      subtype: 'reference',
      default: []
    }
  }
}

exports.CategoryData = {
  ...require('./BaseData'),
  name: 'CategoryData',
  fields: {
    ...require('./BaseData').fields,
    // 所属分类，需要设置mapping
    category: 'reference'
  }
}
