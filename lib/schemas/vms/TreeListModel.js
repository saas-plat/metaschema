module.exports = {
  name: 'TreeListModel',
  ...require('./ListModel'),
  fields: {
    ...require('./ListModel').fields,
    category: {
      type: 'TreeModel',
      columns: []
    },
  }
}
