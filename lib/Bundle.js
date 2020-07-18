const {
  Model
} = require('./Model');
const {
  View
} = require('./View');
const {
  Rule
} = require('./Rule');

// 一组对象的定义和相关规则的集合
exports.Bundle = class Bundle{
  constructor(name, ...objects){
    this.name = name;
    this.models = objects.filter(it=> it instanceof Model);
    this.views = objects.filter(it=> it instanceof View);
    this.rules = objects.filter(it=> it instanceof Rule);
  }
}
