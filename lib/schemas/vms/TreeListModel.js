module.exports = {
  ...require('./ListModel'),
  name: 'TreeListModel',
  fields: {
    ...require('./ListModel').fields,
    category: {
      type: 'TreeModel',
      columns: []
    },
  }
}
