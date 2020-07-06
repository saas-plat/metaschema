module.exports = {
  ...require('./ListModel'),
  name: 'EditListModel',
  fields: {
    ...require('./ListModel').fields,
    voucherlist: {}
  }
}
