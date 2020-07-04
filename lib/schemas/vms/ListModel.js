module.exports = {
  ...require('./BaseModel'),
  fields: {
    ...require('./BaseModel').fields,
    datalist: {
      type: 'GridModel',
      columns: []
    },
  }
}
