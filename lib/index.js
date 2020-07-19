const {
  Schema,
  addTypeCreator,
  createObject
} = require('./Schema');
const {
  Model
} = require('./Model');
const {
  View,
  loadJxon
} = require('./View');
const {
  Rule
} = require('./Rule');
const {
  Bundle
} = require('./Bundle');

exports.utils = {
  addTypeCreator,
  createObject,
  loadJxon
}

// 标准模型schemas
const BaseEntity = () => require('./schemas/entities/BaseEntity');
const BaseData = () => require('./schemas/entities/BaseData');
const CompositeData = () => require('./schemas/entities/CompositeData');
const CategoryData = () => require('./schemas/entities/CategoryData');
const LevelData = () => require('./schemas/entities/LevelData');

const BaseTable = () => require('./schemas/tables/BaseTable');
const DataTable = () => require('./schemas/tables/DataTable');
const SumTable = () => require('./schemas/tables/SumTable');
const TreeTable = () => require('./schemas/tables/TreeTable');
const UnionTable = () => require('./schemas/tables/UnionTable');

const BaseModel = () => require('./schemas/vms/BaseModel');
const FormModel = () => require('./schemas/vms/FormModel');
const FormListModel = () => require('./schemas/vms/FormListModel');
const TreeListModel = () => require('./schemas/vms/TreeListModel');
const CardModel = () => require('./schemas/vms/CardModel');

exports.Types = require('./schemas/types');

// 下面是schema需要生成model
exports.Entity = (name, fields, options) => {
  return new Model(name, Schema.create(BaseEntity(), fields), options);
}
exports.BaseEntity = (name, fields, options) => {
  return new Model(name, Schema.create(BaseEntity(), fields), options);
}
exports.BaseData = (name, fields, options) => {
  return new Model(name, Schema.create(BaseData(), fields), options);
}
exports.CompositeData = (name, fields, options) => {
  return new Model(name, Schema.create(CompositeData(), fields), options);
}
exports.CategoryTree = (name, fields, options) => {
  return new Model(name, Schema.create(CategoryData().CategoryTree, fields), options);
}
exports.CategoryData = (name, fields, options) => {
  return new Model(name, Schema.create(CategoryData().CategoryData, fields), options);
}
exports.LevelData = (name, fields, options) => {
  return new Model(name, Schema.create(LevelData(), fields), options);
}

exports.Table = (name, fields, options) => {
  return new Model(name, Schema.create(BaseTable(), fields), options);
}
exports.BaseTable = (name, fields, options) => {
  return new Model(name, Schema.create(BaseTable(), fields), options);
}
exports.DataTable = (name, fields, options) => {
  return new Model(name, Schema.create(DataTable(), fields), options);
}
exports.SumTable = (name, fields, options) => {
  return new Model(name, Schema.create(SumTable(), fields), options);
}
exports.TreeTable = (name, fields, options) => {
  return new Model(name, Schema.create(TreeTable(), fields), options);
}
exports.UnionTable = (name, fields, options) => {
  return new Model(name, Schema.create(UnionTable(), fields), options);
}

exports.ViewModel = (name, fields, options) => {
  return new Model(name, Schema.create(BaseModel(), fields), options);
}
exports.FormModel = (name, fields, options) => {
  return new Model(name, Schema.create(FormModel(), fields), options);
}
exports.FormListModel = (name, fields, options) => {
  return new Model(name, Schema.create(FormListModel(), fields), options);
}
exports.TreeListModel = (name, fields, options) => {
  return new Model(name, Schema.create(TreeListModel(), fields), options);
}
exports.CardModel = (name, fields, options) => {
  return new Model(name, Schema.create(CardModel(), fields), options);
}

// 这三个是固定类型
exports.Command = new Model('Command');
exports.Event = new Model('Event');
exports.Action = new Model('Action');

// 这两个是对象不是模型
exports.View = (name, dom, viewModelSchema) => {
  return View.create(name, null, dom, viewModelSchema);
}
exports.Rule = (name, when, then, series = 'std') => {
  return Rule.create(name, when, then, 'handle', series);
}
// 数据升级规则
exports.MigrateRule = (name, when, then, series = 'std') => {
  return Rule.create(name, when, then, 'migration', series);
}

exports.Schema = Schema;
exports.Model = Model;
exports.Bundle = (name, ...objects) => new Bundle(name, ...objects);
