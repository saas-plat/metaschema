const keys = require('lodash/keys');
const isArray = require('lodash/isArray');
const isPlainObject = require('lodash/isPlainObject');
const i18n = require('./i18n');
const debug = require('debug')('saas-plat:Rule');

// 解析对象格式的Constraints
const parseRule = exports.parseRule = (obj) => {
  if (isArray(obj)) {
    return obj.map(parseRule);
  } else if (isPlainObject(obj)) {
    const constraint = [];
    const moreconstraints = [];
    keys(obj).forEach(key => {
      if (key === 'or') {
        const constraint = [key];
        //debug(obj[key])
        const subconstraint = parseRule(obj[key]);
        debug('subconstraint %o', subconstraint);
        if (isArray(subconstraint)) {
          constraint.push(...subconstraint)
        } else {
          constraint.push(subconstraint);
        }
        moreconstraints.push(constraint)
      } else if (key === 'not' || key === 'exists') {
        const constraint = [key];
        const subconstraint = parseRule(obj[key]);
        debug('subconstraint %o', subconstraint);
        if (!isArray(subconstraint)) {
          throw new Error(i18n.t('无效的约束条件在{{key}}附近', {
            key
          }))
        }
        constraint.push(...subconstraint);
        moreconstraints.push(constraint);
      } else if (key === 'pattern') { // 自定义的key
        constraint[2] = obj[key];
      } else if (key === 'sequence') {
        constraint[3] = {
          [key]: obj[key]
        };
      } else if (key === 'from') {
        constraint[4] = key + ' ' + obj[key];
      } else {
        constraint[0] = obj[key];
        constraint[1] = key;
      }
    });
    //debug('constraint %o', constraint)
    let ret = [constraint, ...moreconstraints].filter(it => it.length > 0);
    if (ret.length == 1 && isArray(ret[0])) {
      ret = ret[0];
    }
    debug('constraints %o', ret)
    return ret;
  } else {
    return obj;
  }
}

exports.Rule = class Rule {
  constructor(name, when, then) {
    if (!name || !when || !then || !isArray(when)) {
      throw new Error(i18n.t('规则无效'));
    }
    this.name = name;
    this.when = when;
    this.then = then;
  }

  static create(
    name,
    when,
    then
  ) {
    return new Rule(name, parseRule(when), then);
  }
}
