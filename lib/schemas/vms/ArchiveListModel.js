module.exports = {
  ...require('./ListModel'),
  name: 'ArchiveListModel',
  fields: {
    ...require('./ListModel').fields,
    category: {
      type: 'TreeModel',
      columns: []
    },
  }
}
