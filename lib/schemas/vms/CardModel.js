
module.exports = {
  name: 'CardModel',
  ...require('./FormModel'),
  fields: {
    ...require('./FormModel').fields,
  }
}
