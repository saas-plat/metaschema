module.exports = {
  ...require('./BaseModel'),
  name: 'ReferModel',
  fields: {
    ...require('./BaseModel').fields,
  }
}
