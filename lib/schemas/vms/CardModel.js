module.exports = {
  ...require('./FormModel'),
  name: 'CardModel',
  fields: {
    ...require('./FormModel').fields,
  }
}
