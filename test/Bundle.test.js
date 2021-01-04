const { expect } = require('chai');
const { Bundle, ViewModel } = require('../lib');

describe('打包', () => {
  it('建立对象规则关系', () => {
    const b = Bundle('test aa', { a: ViewModel('aa', {}) });
    const m = b.getModel('aa');
    expect(m).to.not.null;
    expect(b.getModel('a')).to.be.undefined;
  });
});
