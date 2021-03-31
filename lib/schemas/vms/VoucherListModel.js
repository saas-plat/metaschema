module.exports = {
  ...require('./ListModel'),
  name: 'VoucherListModel',
  fields: {
    ...require('./ListModel').fields,

    searchplan: {
      type: 'FilterModel',
      //selectedId: 'string'
    }
  }
}
