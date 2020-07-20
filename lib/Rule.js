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

const gt = exports.gt = (v1, v2) => {
  const vk1 = v1.split('.').map(v => parseInt(v));
  const vk2 = v2.split('.').map(v => parseInt(v));
  for (let i = 0; i < vk1.length || i < vk2.length; i++) {
    if (vk1[i] > vk2[i]) {
      return true;
    }
  }
  return false;
}

// 版本version是否在升级范围内
exports.versionAt = (action, version) => {
  return gt(version || '', action.from || '') && !gt(version, action.to);
}

// 序列是否在升级范围内
exports.seriesIn = (action, ...series) => {
  return series.indexOf(action.series) > -1;
}

exports.Rule = class Rule {
  constructor(name, when, then, options) {
    if (!name || !when || !then || !isArray(when)) {
      throw new Error(i18n.t('规则无效'));
    }
    this.name = name;
    this.when = when;
    this.then = then;
    this.options = options;
  }

  static create(
    name,
    when,
    then,
    options
  ) {
    return new Rule(name, parseRule(when), then, options);
  }
}
