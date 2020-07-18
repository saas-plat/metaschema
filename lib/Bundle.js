const {
  Model
} = require('./Model');
const {
  View
} = require('./View');
const {
  Rule
} = require('./Rule');

// 一个主对象的定义和相关规则的关系构成一个包
exports.Bundle = class Bundle {
  constructor(name, ...objects) {
    this.name = name;
    this.main = objects.find(it => it instanceof Model || it instanceof View);
    this.rules = objects.filter(it => it instanceof Rule);
  }
}
