module.exports = {
  ...require('./CardModel'),
  name: 'VoucherModel',
  fields: {
    ...require('./CardModel').fields,
  }
}
