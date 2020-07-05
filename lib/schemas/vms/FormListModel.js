module.exports = {
  name: 'FormListModel',
  ...require('./ListModel'),
  fields: {
    ...require('./ListModel').fields,

    searchplan: {
      type: 'FilterModel',
      //selectedId: 'string'
    }
  }
}
