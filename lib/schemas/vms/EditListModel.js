
module.exports = {
  name: 'EditListModel',
  ...require('./ListModel'),
  fields: {
    ...require('./ListModel').fields,
    voucherlist: {}
  }
}
