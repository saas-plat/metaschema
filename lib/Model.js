// 模型的定义, 不是具体的模型, 具体模型是动态生成的class
exports.Model = class Model{
  constructor(name, schema, options){
    this.name = name;
    this.schema = schema;
    this.options = options;
  }
}
