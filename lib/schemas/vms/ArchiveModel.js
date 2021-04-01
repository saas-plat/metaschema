module.exports = {
  ...require('./CardModel'),
  name: 'ArchiveModel',
  fields: {
    ...require('./CardModel').fields,
  }
}
