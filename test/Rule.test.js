const {
  expect
} = require('chai');
const {
  Rule,
  versionAt,
  seriesIn
} = require('../lib');
require('i18next').init();

describe('业务规则定义', () => {
  const then = (facts) => {
    // i18n执行时在闭包里解构
    api.i18n.t('xxxxxxxxx');
    facts.called.count++;
  }
  const p1 = ({
    n1
  }) => n1 == 1;
  const p2 = ({
    s1
  }) => s1 == 'hello';
  const p3 = facts => facts.d1.getDate() == new Date().getDate();

  it('定义一个规则', () => {

    const rule = Rule('xxxx rule', [{
      "n1": Number,
      "pattern": p1
    }, {
      "s1": String,
      "pattern": p2,
      sequence: 's2'
    }, {
      "called": "Count"
    }], then);
    expect(rule.name).to.be.eql('xxxx rule');
    expect(rule.then).to.be.eql(then)
    console.log(rule.when)
    expect(rule.when).to.deep.include.members([
      [Number, "n1", p1],
      [String, "s1", p2, {
        sequence: 's2'
      }],
      ["Count", "called"]
    ])

    console.log('-------2---------')

    const rule2 = Rule('xxxx rule2', {
      "or": [{
          "not": {
            "n1": Number,
            "pattern": p1
          }
        },
        {
          "not": {
            "s1": String,
            "pattern": p2
          }
        },
        {
          "not": {
            "d1": Date,
            "pattern": p3
          }
        }
      ],
      "called": "Count"
    }, then);
    expect(rule2.name).to.be.eql('xxxx rule2');
    expect(rule2.then).to.be.eql(then)
    console.log(rule2.when)
    expect(rule2.when).to.deep.include.members([
      ["or",
        ["not", Number, "n1", p1],
        ["not", String, "s1", p2],
        ["not", Date, "d1", p3]
      ],
      ["Count", "called"]
    ])

    console.log('-------3---------')

    const rule3 = Rule('xxxx rule3', {
      "not": {
        "s1": String,
        "pattern": p2
      },
      "called": "Count"
    }, then);
    expect(rule3.name).to.be.eql('xxxx rule3');
    expect(rule3.then).to.be.eql(then)
    console.log(rule3.when)
    expect(rule3.when).to.deep.include.members([
      ["not", String, "s1", p2],
      ["Count", "called"]
    ])

  })

  it('支持数组约束定义', () => {
    const rule = Rule('bbb rule', [
      ["or",
        ["not", Number, "n1", p1],
        ["not", String, "s1", p2],
        ["not", Date, "d1", p3]
      ],
      ["Count", "called"]
    ], then)

    expect(rule.name).to.be.eql('bbb rule');
    expect(rule.then).to.be.eql(then)
    console.log(rule.when)
    expect(rule.when).to.deep.include.members([
      ["or",
        ["not", Number, "n1", p1],
        ["not", String, "s1", p2],
        ["not", Date, "d1", p3]
      ],
      ["Count", "called"]
    ])

  })

  it('函数versionAt和seriesIn支持升级判断', () => {
    expect(versionAt({}, '3.0.0')).to.be.false;
    expect(versionAt({
      from: '1.0.0',
      to: '2.0.0'
    }, '3.0.0')).to.be.false;
    expect(versionAt({
      from: '2.0.0',
      to: '3.0.0'
    }, '3.0.0')).to.be.true;
    expect(seriesIn({}, 'industry2', 'industry3')).to.be.false;
    expect(seriesIn({
      series: 'sss'
    }, 'industry2', 'industry3')).to.be.false;
    expect(seriesIn({
      series: 'industry3'
    }, 'industry2', 'industry3')).to.be.true;
  })

  it('支持的when写法', () => {
    const condition = e => e.name == 'Department.migrate' && e.event == 'saved' && versionAt(e, '2.0.0');
    const rule = Rule('update_sciprt1', {
      e: 'Action',
      condition
    }, () => {
      console.log('update to 2.0.0');
    });
    expect(rule.when).to.deep.include.members(
      ["Action", "e", condition]
    )
  })
})
