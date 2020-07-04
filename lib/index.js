const {
  Schema
} = require('./Schema');
const {
  Model
} = require('./Model');
const {
  View
} = require('./View');
const {
  Rule
} = require('./Rule');
const {
  apis
} = require('./api');

exports.api = apis;

const BaseEntity = require('./schemas/entities/BaseEntity');
const BaseData = require('./schemas/entities/BaseData');
const CompositeData = require('./schemas/entities/CompositeData');
const {
  CategoryTree,
  CategoryData
} = require('./schemas/entities/CategoryData');
const LevelData = require('./schemas/entities/LevelData');

const BaseTable = require('./schemas/tables/BaseTable');
const DataTable = require('./schemas/tables/DataTable');
const SumTable = require('./schemas/tables/SumTable');
const TreeTable = require('./schemas/tables/TreeTable');
const UnionTable = require('./schemas/tables/UnionTable');

const BaseModel = require('./schemas/vms/BaseModel');
const FormModel = require('./schemas/vms/FormModel');
const FormListModel = require('./schemas/vms/FormListModel');
const TreeListModel = require('./schemas/vms/TreeListModel');
const CardModel = require('./schemas/vms/CardModel');

exports.Entity = (name, fields) => {
  return new Model(name, Schema.create(BaseEntity, fields));
}
exports.BaseData = (name, fields) => {
  return new Model(name, Schema.create(BaseData, fields));
}
exports.CompositeData = (name, fields) => {
  return new Model(name, Schema.create(CompositeData, fields));
}
exports.CategoryTree = (name, fields) => {
  return new Model(name, Schema.create(CategoryTree, fields));
}
exports.CategoryData = (name, fields) => {
  return new Model(name, Schema.create(CategoryData, fields));
}
exports.LevelData = (name, fields) => {
  return new Model(name, Schema.create(LevelData, fields));
}

exports.Table = (name, fields) => {
  return new Model(name, Schema.create(BaseTable, fields));
}
exports.DataTable = (name, fields) => {
  return new Model(name, Schema.create(DataTable, fields));
}
exports.SumTable = (name, fields) => {
  return new Model(name, Schema.create(SumTable, fields));
}
exports.TreeTable = (name, fields) => {
  return new Model(name, Schema.create(TreeTable, fields));
}
exports.UnionTable = (name, fields) => {
  return new Model(name, Schema.create(UnionTable, fields));
}

exports.ViewModel = (name, fields) => {
  return new Model(name, Schema.create(BaseModel, fields));
}
exports.FormModel = (name, fields) => {
  return new Model(name, Schema.create(FormModel, fields));
}
exports.FormListModel = (name, fields) => {
  return new Model(name, Schema.create(FormListModel, fields));
}
exports.TreeListModel = (name, fields) => {
  return new Model(name, Schema.create(TreeListModel, fields));
}
exports.CardModel = (name, fields) => {
  return new Model(name, Schema.create(CardModel, fields));
}

exports.View = (dom, viewModelSchema) => {
  return View.create(null, dom, viewModelSchema);
}
exports.Rule = (name, when, then) => {
  return Rule.create(name, when, then);
}
