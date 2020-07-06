module.exports = {
  ...require('./BaseModel'),
  name: 'ListModel',
  fields: {
    ...require('./BaseModel').fields,
    datalist: {
      type: 'GridModel',
      columns: []
    },
  }
}
