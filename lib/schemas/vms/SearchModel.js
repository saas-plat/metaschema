module.exports = {
  ...require('./BaseModel'),
  name: 'SearchModel',
  fields: {
    ...require('./BaseModel').fields,
  }
}
