
module.exports = {
  name: 'ReferModel',
  ...require('./BaseModel'),
  fields: {
    ...require('./BaseModel').fields,
  }
}
