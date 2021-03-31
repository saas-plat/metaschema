const { Schema, addTypeCreator, createObject } = require('./Schema');
const { Model } = require('./Model');
const { View, loadJxon } = require('./View');
const { Rule, versionAt, seriesIn } = require('./Rule');
const { Schedule } = require('./Schedule');
const { Bundle } = require('./Bundle');
const { SchemaError } = require('./SchemaError');

exports.utils = {
  addTypeCreator,
  createObject,
  loadJxon,
};

// 标准模型schemas
const BaseEntity = () => require('./schemas/entities/BaseEntity');
const ArchiveData = () => require('./schemas/entities/BaseData');
const VoucherData = () => require('./schemas/entities/CompositeData');
const CategoryData = () => require('./schemas/entities/CategoryData');
const LevelData = () => require('./schemas/entities/LevelData');

const BaseTable = () => require('./schemas/tables/BaseTable');
const DataTable = () => require('./schemas/tables/DataTable');
const SumTable = () => require('./schemas/tables/SumTable');
const TreeTable = () => require('./schemas/tables/TreeTable');
const UnionTable = () => require('./schemas/tables/UnionTable');

const BaseModel = () => require('./schemas/vms/BaseModel');
const VoucherModel = () => require('./schemas/vms/VoucherModel');
const VoucherListModel = () => require('./schemas/vms/VoucherListModel');
const ArchiveListModel = () => require('./schemas/vms/ArchiveListModel');
const ArchiveModel = () => require('./schemas/vms/ArchiveModel');

const BaseCommand = () => require('./schemas/commands/BaseCommand');
const BaseEvent = () => require('./schemas/events/BaseEvent');

const BaseJob = () => require('./schemas/jobs/BaseJob');

exports.Types = require('./schemas/types');

// 下面是schema需要生成model
exports.Entity = (name, fields, options) => {
  return new Model(name, Schema.create(BaseEntity(), fields), options);
};
exports.BaseEntity = (name, fields, options) => {
  return new Model(name, Schema.create(BaseEntity(), fields), options);
};
// 基础数据档案
exports.ArchiveEntity = exports.BaseData = (name, fields, options) => {
  return new Model(name, Schema.create(ArchiveData(), fields), options);
};
// 复合实体
exports.VoucherEntity = exports.CompositeData = (name, fields, options) => {
  return new Model(name, Schema.create(VoucherData(), fields), options);
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
exports.TreeQuery = exports.TreeTable = (name, fields, options) => {
  return new Model(name, Schema.create(TreeTable(), fields), options);
};
exports.UnionQuery = exports.UnionTable = (name, fields, options) => {
  return new Model(name, Schema.create(UnionTable(), fields), options);
};

exports.ViewModel = (name, fields, options) => {
  return new Model(name, Schema.create(BaseModel(), fields), options);
};
exports.VoucherModel = (name, fields, options) => {
  return new Model(name, Schema.create(VoucherModel(), fields), options);
};
exports.VoucherListModel = (name, fields, options) => {
  return new Model(name, Schema.create(VoucherListModel(), fields), options);
};
exports.ArchiveListModel = (name, fields, options) => {
  return new Model(name, Schema.create(ArchiveListModel(), fields), options);
};
exports.ArchiveModel = (name, fields, options) => {
  return new Model(name, Schema.create(ArchiveModel(), fields), options);
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

function createView(name, dom, viewModel, options, Model){
  if (viewModel && !(viewModel instanceof Model)) {
    throw new SchemaError('viewModel不是定义的模型');
  }
  const view = View.create(name, null, dom);
  const fields = view.pickSchema();
  if (!viewModel) {
    viewModel = new Model(name + 'VM', Schema.create(Model(), fields), options);
  }else{
    viewModel.schema.merge(fields);
  } 
  view.model = viewModel;
  return view;
}

// 这三个是对象不是模型
exports.View = (name, dom, viewModel, options) => {
  return createView(name, dom, viewModel, options, BaseModel);
};
exports.VoucherView = (name, dom, viewModel, options) => {
  return createView(name, dom, viewModel, options, VoucherModel);
};
exports.VoucherListView = (name, dom, viewModel, options) => {
  return createView(name, dom, viewModel, options, VoucherListModel);
};
exports.ArchiveListView = (name, fdom, viewModel, options) => {
  return createView(name, dom, viewModel, options, ArchiveListModel);
};
exports.ArchiveView = (name, dom, viewModel, options) => {
  return createView(name, dom, viewModel, options, ArchiveModel);
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
