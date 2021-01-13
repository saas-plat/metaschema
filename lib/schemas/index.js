const { Schema, addTypeCreator, createObject } = require('./Schema');
const { Model } = require('./Model');
const { View, loadJxon } = require('./View');
const { Rule, versionAt, seriesIn } = require('./Rule');
const { Schedule } = require('./Schedule');
const { Bundle } = require('./Bundle');

exports.utils = {
  addTypeCreator,
  createObject,
  loadJxon,
};

// 标准模型schemas
const BaseEntity = () => require('./entities/BaseEntity');
const BaseData = () => require('./entities/BaseData');
const CompositeData = () => require('./entities/CompositeData');
const CategoryData = () => require('./entities/CategoryData');
const LevelData = () => require('./entities/LevelData');

const BaseTable = () => require('./tables/BaseTable');
const DataTable = () => require('./tables/DataTable');
const SumTable = () => require('./tables/SumTable');
const TreeTable = () => require('./tables/TreeTable');
const UnionTable = () => require('./tables/UnionTable');

const BaseModel = () => require('./vms/BaseModel');
const FormModel = () => require('./vms/FormModel');
const FormListModel = () => require('./vms/FormListModel');
const TreeListModel = () => require('./vms/TreeListModel');
const CardModel = () => require('./vms/CardModel');

const BaseCommand = () => require('./commands/BaseCommand');
const BaseEvent = () => require('./events/BaseEvent');

const BaseJob = () => require('./jobs/BaseJob');

exports.Types = require('./types');

// 下面是schema需要生成model
exports.Entity = (name, fields, options) => {
  return new Model(name, Schema.create(BaseEntity(), fields), options);
};
exports.BaseEntity = (name, fields, options) => {
  return new Model(name, Schema.create(BaseEntity(), fields), options);
};
// 基础数据档案
exports.DataEntity = exports.BaseData = (name, fields, options) => {
  return new Model(name, Schema.create(BaseData(), fields), options);
};
// 复合实体
exports.CompositeEntity = exports.CompositeData = (name, fields, options) => {
  return new Model(name, Schema.create(CompositeData(), fields), options);
};
// 分类树数据
exports.TreeEntity = exports.CategoryTree = (name, fields, options) => {
  return new Model(
    name,
    Schema.create(CategoryData().CategoryTree, fields),
    options
  );
};
// 分类基础数据
exports.CategoryEntity = exports.CategoryData = (name, fields, options) => {
  return new Model(
    name,
    Schema.create(CategoryData().CategoryData, fields),
    options
  );
};
// 层级关系实体
exports.LevelEntity = exports.LevelData = (name, fields, options) => {
  return new Model(name, Schema.create(LevelData(), fields), options);
};

// table 别名 query
exports.Query = exports.Table = (name, fields, options) => {
  return new Model(name, Schema.create(BaseTable(), fields), options);
};
exports.BaseQuery = exports.BaseTable = (name, fields, options) => {
  return new Model(name, Schema.create(BaseTable(), fields), options);
};
exports.DataQuery = exports.DataTable = (name, fields, options) => {
  return new Model(name, Schema.create(DataTable(), fields), options);
};
exports.SumQuery = exports.SumTable = (name, fields, options) => {
  return new Model(name, Schema.create(SumTable(), fields), options);
};
exports.reeQuery = exports.TreeTable = (name, fields, options) => {
  return new Model(name, Schema.create(TreeTable(), fields), options);
};
exports.UnionQuery = exports.UnionTable = (name, fields, options) => {
  return new Model(name, Schema.create(UnionTable(), fields), options);
};

exports.ViewModel = (name, fields, options) => {
  return new Model(name, Schema.create(BaseModel(), fields), options);
};
exports.FormModel = (name, fields, options) => {
  return new Model(name, Schema.create(FormModel(), fields), options);
};
exports.FormListModel = (name, fields, options) => {
  return new Model(name, Schema.create(FormListModel(), fields), options);
};
exports.TreeListModel = (name, fields, options) => {
  return new Model(name, Schema.create(TreeListModel(), fields), options);
};
exports.CardModel = (name, fields, options) => {
  return new Model(name, Schema.create(CardModel(), fields), options);
};

exports.Command = (name, fields, options) => {
  return new Model(name, Schema.create(BaseCommand(), fields), options);
};
// 业务事件也需要定义出来，要不其他系统订阅时无法获取定义信息
exports.Event = (name, fields, options) => {
  return new Model(name, Schema.create(BaseEvent(), fields), options);
};
exports.Action = (name, options) => {
  return new Model(name, null, options);
};
// 定时任务
exports.Job = (name, options) => {
  return new Model(name, Schema.create(BaseJob(), {}), options);
};

// 这三个是对象不是模型
exports.View = (name, dom, viewModelSchema) => {
  return View.create(name, null, dom, viewModelSchema);
};
exports.Rule = (name, when, then, options = {}) => {
  return Rule.create(name, when, then, options);
};
// 定时计划
exports.Schedule = (name, spec, job, action, options) => {
  return Schedule.create(name, spec, job, action, options);
};

exports.versionAt = versionAt;
exports.seriesIn = seriesIn;

exports.Schema = Schema;
exports.Model = Model;

// 导出集合包
exports.Bundle = (name, objects) => new Bundle(name, objects);
exports.requireBundle = (name) => {
  // TODO
};
