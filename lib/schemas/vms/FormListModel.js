module.exports = {
  ...require('./ListModel'),
  name: 'FormListModel',
  fields: {
    ...require('./ListModel').fields,

    searchplan: {
      type: 'FilterModel',
      //selectedId: 'string'
    }
  }
}
