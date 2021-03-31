const { Model } = require('./Model');
const { View } = require('./View');
const { Rule } = require('./Rule');
const { Schedule } = require('./Schedule');
const values = require('lodash/values');

// 一个主对象的定义和相关规则的关系构成一个包
exports.Bundle = class Bundle {
  get models() {
    return this.items.filter((it) => it instanceof Model);
  }

  get rules() {
    return this.items.filter((it) => it instanceof Rule);
  }

  get views() {
    return this.items.filter((it) => it instanceof View);
  }

  get schedules() {
    return this.items.filter((it) => it instanceof Schedule);
  }

  getModel(name) {
    return this.models.find((it) => it.name === name);
  }

  getView(name) {
    return this.views.find((it) => it.name === name);
  }

  getSchedule(name) {
    return this.schedules.find((it) => it.name === name);
  }

  getRule(name) {
    return this.rules.find((it) => it.name === name);
  }

  // by type filter
  getRules(type) {
    return this.rules.filter((it) => it.options.type === type);
  }

  getItem(name) {
    return this.items.find((it) => it.name === name);
  }

  getItems(Type) {
    return this.items.filter((it) => it instanceof Type);
  }

  constructor(name, objects) {
    if (objects instanceof Bundle) {
      this.name = objects.name || name;
      this.items = objects.items;
    } else {
      this.name = name;
      this.items = values(objects);
      // 从view中把 **表单字段** 和 **行为字段** 提取合并到 **同名** vm中
      for (const viewMeta of this.views) {
        const model = this.models.find(
          (it) => it.options.view === viewMeta.name
        );
        if (!model) {
          continue;
        }
        model.schema.merge(viewMeta.pickSchema());
      }
    }
  }
};
