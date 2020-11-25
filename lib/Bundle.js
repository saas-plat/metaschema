const { Model } = require('./Model');
const { View } = require('./View');
const { Rule } = require('./Rule');
const { Schedule } = require('./Schedule');

// 一个主对象的定义和相关规则的关系构成一个包
exports.Bundle = class Bundle {
  get main() {
    return this.objects.find((it) => it instanceof View || it instanceof Schedule || it instanceof Model);
  }

  get models() {
    return this.objects.filter((it) => it instanceof Model);
  }

  get rules() {
    return this.objects.filter((it) => it instanceof Rule);
  }

  getModel(name) {
    return this.models.find((it) => it.name === name);
  }

  getRule(name) {
    return this.rules.find((it) => it.name === name);
  }

  getItem(name) {
    return this.objects.find((it) => it.name === name);
  }

  constructor(name, ...objects) {
    this.name = name;
    this.objects = objects;
  }
};
