module.exports = {
  ...require('./BaseEntity'),
  name: 'LevelData',
  fields: {
    ...require('./BaseEntity').fields,

    // parent和childs需要具体类mapping
    parent: 'reference',
    childs: {
      type: 'array',
      subtype: 'reference',
      default: []
    },

    deep: 'number',
    level: 'string'
  }
}
