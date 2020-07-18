const {
  expect
} = require('chai');
const {
  Bundle,
  ViewModel
} = require('../lib');

describe('打包', () => {

  it('建立对象规则关系', () => {
    Bundle('test aa', ViewModel('aa', {}))
  })
})
