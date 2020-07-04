module.exports = {
  ...require('./ListModel'),
  fields: {
    ...require('./ListModel').fields,
    category: {
      type: 'TreeModel',
      columns: []
    },
  }
}
