const isSymbol = require('lodash/isSymbol');
const isFunction = require('lodash/isFunction');

exports.String = String;
exports.Object = Object;
exports.Array = Array;
exports.Number = Number;
exports.Boolean = Boolean;
exports.Date = Date;
exports.Function = Function;

const Reference = exports.Reference = Symbol.for('reference');
const Buffer = exports.Buffer = Symbol.for('buffer');
const Mixed = exports.Mixed = Symbol.for('mixed');

const SimpleModel = exports.SimpleModel = Symbol.for('SimpleModel');
const ListModel = exports.ListModel = Symbol.for('ListModel');
const TableModel = exports.TableModel = Symbol.for('TableModel');
const FilterModel = exports.FilterModel = Symbol.for('FilterModel');
const TreeModel = exports.TreeModel = Symbol.for('TreeModel');

const types = [
  String, Object, Array, Number, Boolean, Date, Function,
  Reference, Buffer, Mixed,
  SimpleModel, ListModel, TableModel, FilterModel, TreeModel
]

const isSchemaType = exports.isSchemaType = type => {
  return types.indexOf(type) > -1;
}

exports.getSchemaTypeKey = type => {
  if (!isSchemaType(type)) {
    return null;
  } else if (isSymbol(type)) {
    return Symbol.keyFor(type);
  } else if (isFunction(type)) {
    return type.name.toLowerCase();
  } else {
    throw new Error('not support type', type);
  }
}
