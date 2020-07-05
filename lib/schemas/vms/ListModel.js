module.exports = {
  name: 'ListModel',
  ...require('./BaseModel'),
  fields: {
    ...require('./BaseModel').fields,
    datalist: {
      type: 'GridModel',
      columns: []
    },
  }
}
