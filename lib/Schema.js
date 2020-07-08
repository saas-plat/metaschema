const keys = require('lodash/keys');
const mapKeys = require('lodash/mapKeys');
const mapValues = require('lodash/mapValues');
const omitBy = require('lodash/omitBy');
const assign = require('lodash/assign');
const camelCase = require('lodash/camelCase');
const toArray = require('lodash/toArray');
const toString = require('lodash/toString');
const toNumber = require('lodash/toNumber');
const toPlainObject = require('lodash/toPlainObject');
const isString = require('lodash/isString');
const isNull = require('lodash/isNull');
const isUndefined = require('lodash/isUndefined');
const isPlainObject = require('lodash/isPlainObject');
const isFunction = require('lodash/isFunction');
const isArray = require('lodash/isArray');
const isObject = require('lodash/isObject');
const mapper = require('automapper');
const moment = require('moment');
const i18n = require('./i18n');
const debug = require('debug')('saas-plat:Schema');

const getMetaItem = (it, types) => {
  let type;
  let subtype;
  let fields;
  let defValue;
  let src;
  let rules;
  let mapping;
  let index;
  let description;
  let handle;
  if (typeof it === 'string') {
    it = it === 'ref' ? 'reference' : it;
    it = it === 'obj' ? 'object' : it;
    it = it === 'bool' ? 'boolean' : it;
    it = it === 'func' ? 'function' : it;
    type = types.indexOf(it) > -1 ? it : 'reference';
    if (type === 'reference' && it !== type) {
      src = it;
    }
    if (type === 'function') {
      // 这里定义没有意义
      handle = none;
      debug('function none!');
    }
  } else if ('type' in it || keys(it).some(key => key.startsWith('_') || key.startsWith('$'))) {
    let {
      //type,
      // fields,
      defaultValue,
      //defValue,
      //default,
      // 系统字段以$和_开头
      $type,
      $subtype,
      $fields,
      $defValue,
      $default,
      $defaultValue,
      $src,
      $rules,
      $mapping,
      $index,
      $description,
      $handle,
      _type = $type,
      _subtype = $subtype,
      _fields = $fields,
      _defValue = $defValue,
      _default = $default,
      _defaultValue = $defaultValue,
      _src = $src,
      _rules = $rules,
      _mapping = $mapping,
      _index = $index,
      _description = $description,
      _handle = $handle,
      ...other
    } = it;
    type = _type || it.type || 'string';
    type = type === 'ref' ? 'reference' : type;
    type = type === 'obj' ? 'object' : type;
    type = type === 'bool' ? 'boolean' : type;
    type = type === 'func' ? 'function' : type;
    type = type === 'expr' ? 'expression' : type;
    type = types.indexOf(type) > -1 ? type : 'reference';
    if (type === 'reference' && it.type !== type) {
      src = it.type;
    }
    // 所有大写字母开头都是自定义类型,和object相同处理
    const isCustomeType = type.substr(0, 1) === type.substr(0, 1).toUpperCase();
    fields = type === 'object' || type === 'array' || isCustomeType ?
      getMeta(_fields || it.fields, types) : undefined;
    subtype = _subtype || it.subtype;
    subtype = subtype === 'ref' ? 'reference' : subtype;
    subtype = subtype === 'obj' ? 'object' : subtype;
    subtype = subtype ? (types.indexOf(subtype) > -1 ? subtype : 'reference') : subtype;
    if (subtype === 'reference' && it.subtype !== subtype) {
      src = it.subtype;
    }
    defValue = _defValue || _default || _defaultValue || it['default'] || it.defValue || defaultValue;
    src = _src || it.src || src;
    index = _index || it.index;
    description = _description || it.description;
    if (type === 'function') {
      handle = _handle || it.handle;
      if (isArray(handle)) {
        handle = new Function('eventData', 'params', handle.join('\n'));
      } else if (typeof handle !== 'function') {
        if (typeof handle === 'string') {
          handle = new Function('eventData', 'params', handle);
        } else { // if (isUndefined(handle))
          handle = none;
          // 取消常量的函数，表意不清晰为啥string就不是常量
          // } else {
          //   const v = handle;
          //   handle = () => v;
        }
      }
    }
    delete other.type;
    delete other.fields;
    delete other.subtype;
    delete other['default'];
    delete other.defValue;
    delete other.mapping;
    delete other.src;
    delete other.index;
    delete other.rules;
    delete other.description;
    delete other.handle;
    rules = _rules || it.rules || {
      type: isCustomeType ? 'object' : type,
      ...other
    };
    // 映射字段名称，比如模型的必要字段可以映射改名
    mapping = _mapping || it.mapping;
  } else if (Array.isArray(it)) {
    type = 'array';
    let sub;
    if (it.length > 0) {
      sub = getMetaItem(it[0], types);
      if (!sub) {
        sub = {
          type: 'object',
          fields: getMeta(it[0], types)
        };
      }
    } else {
      sub = {
        type: 'object',
        fields: getMeta(it.fields, types)
      };
    }
    subtype = sub.type;
    fields = sub.fields;
    src = sub.src;
    rules = sub.rules;
  } else if (typeof it === 'object') {
    type = 'object';
    fields = getMeta(it, types);
  } else if (typeof it === 'function') {
    type = 'function';
    handle = it;
  } else {
    return null;
  }
  return {
    type,
    subtype, // 数组的元素对象类型
    fields,
    defValue,
    src, // 引用类型对象
    rules, // 校验规则
    mapping,
    index, // 查找索引
    description, // 描述信息
    handle, // 行为函数
    // toJSON: function () {
    //   // 增加函数的序列化
    //   return mapValues(this, v => isFunction(v) ? v.toString() : v);
    // }
  };
}
const getMeta = exports.getMeta = (obj, types) => {
  const fields = [];
  isPlainObject(obj) && keys(obj).forEach(key => {
    // 不允许$和_开头的key，系统字段
    if (key.startsWith('$') || key.startsWith('_')) {
      debug(key + ' skip!!');
      return;
    }
    const field = getMetaItem(obj[key], types);
    if (!field) {
      console.warn('not support type', key);
    }
    fields.push({
      key,
      ...field
    });
  });
  return fields;
}
const findField = exports.findField = (fields, path, i = 0) => {
  let key = path[i];
  if (key.endsWith(']')) {
    key = key.substr(0, key.indexOf('['))
  }
  const sub = fields.find(it => it.key === key);
  if (i + 1 < path.length) {
    return findField(sub.fields, path, i + 1);
  }
  if (!sub) {
    throw new Error(key + ' not defined!');
  }
  return sub;
}

const getFieldMapings = exports.getFieldMapings = (fields = [], defFields = []) => {
  return fields.reduce((maps, it) => {
    if (it.type === 'object') {
      const ret = getFieldMapings(it.fields, defFields[it.key] || []);
      if (keys(ret).length > 0) {
        maps[it.key] = ret;
      }
    } else if (it.subtype === 'object') {
      const ret = getFieldMapings(it.fields, defFields[it.key] || []);
      if (keys(ret).length > 0) {
        maps[it.key] = [ret];
      }
    } else if (it.mapping) {
      maps[it.mapping] = it.key;
    } else if (defFields.some(dit => dit.key === it.key)) {
      // 如果没有设置mapping字段，自动按照名称匹配
      const exists = defFields.find(dit => dit.key === it.key);
      if (it.type !== undefined && exists.type !== it.type) {
        //debug(it)
        throw new Error(i18n.t('{{key}}字段类型冲突，必须是{{type}}类型', exists));
      }
      maps[it.key] = it.key;
    }
    return maps;
  }, {});
}

const checkKeys = exports.checkKeys = ['type', 'subtype', 'defValue', 'src'];

const checkRequiredFieldMap = exports.checkRequiredFieldMap = (fields, mappings, mapFields) => {
  const errFields = [];
  const defectFields = [];
  fields.forEach(it => {
    // 不在mapping里自动补充
    if (it.type === 'object' || it.subtype === 'object') {
      const rfm = checkRequiredFieldMap(it.fields || [], mappings[it.key] || {}, mapFields.find(it => it.key === mappings[it.key]));
      defectFields.push({
        ...it,
        fields: rfm.defectFields
      });
      if (rfm.errFields.length > 0) {
        errFields.push({
          ...it,
          fields: rfm.errFields
        });
      }
    } else if (it.key in mappings) {
      // WHY 这里不创建pkey下面find不好使??
      const pkey = mappings[it.key];
      const pFields = mapFields.find(it => it.key === pkey);
      const nKey = keys(it).find(key => {
        if (checkKeys.indexOf(key) === -1) {
          return false;
        }
        if (!isUndefined(it[key]) && pFields[key] !== it[key]) {
          return true;
        }
      });
      if (nKey) {
        //  检查mapping是否包含比配置信息，比如默认值，subtype等
        if (!isUndefined(pFields[nKey])) {
          debug('conflict %s: %s != %s', nKey, pFields[nKey], it[nKey]);
          errFields.push(it);
        } else {
          defectFields.push({
            ...it,
            key: pkey
          });
        }
      }
    } else if (it.type === 'reference' || it.subtype === 'reference') {
      if (it.src) {
        defectFields.push(it);
      } else {
        debug('defect %s src', it.key);
        // 引用类型无法自动补充
        errFields.push(it);
      }
    } else {
      defectFields.push(it);
    }
  });
  return {
    defectFields,
    errFields
  };
}

const getKeyPaths = exports.getKeyPaths = (fields = [], pname = '') => {
  return fields.reduce((paths, it) => {
    const key = [pname, it.key].filter(it => it).join('.');
    if (it.type === 'object') {
      return paths.concat(...getKeyPaths(it.fields, it.key));
    } else if (it.subtype === 'object') {
      return paths.concat(...getKeyPaths(it.fields, it.key));
    }
    return paths.concat(key);
  }, []);
}

const unionFields = exports.unionFields = (...fieldsList) => {
  return fieldsList.reduce((ret, fields) => {
    for (const it of fields) {
      const exists = ret.find(rit => rit.key === it.key);
      if (!exists) {
        ret.push(it);
        continue;
      }
      if (exists.type === 'object') {
        //debug(it,exists)
        exists.fields = unionFields(exists.fields || [], it.fields || []);
        // } else if (exists.subtype === 'object') {
        //   exists.fields = unionFields(exists.fields, it.fields);
      } else {
        assign(exists, omitBy(it, isUndefined));
      }
    }
    return ret;
  }, []);
}

const createMappingProps = exports.createMappingProps = (target, mappings) => {
  keys(mappings).forEach(mkey => {
    const userkey = mappings[mkey];
    let getfn, setfn;
    getfn = () => {
      // debug(mkey, '<=', userkey)
      return target[userkey];
    }
    if (typeof userkey === 'string') {
      // 不需要映射
      if (userkey === mkey) {
        return;
      }
      setfn = (value) => {
        // debug(mkey, '=>', userkey)
        target[userkey] = value;
      }
    } else if (isArray(userkey)) {
      const submapping = userkey[0];
      setfn = (value) => {
        // debug(mkey, '=>', userkey)
        if (!value) {
          target[mkey] = value;
        } else {
          target[mkey] = toArray(value).map(it => createMappingProps(it, submapping));
        }
      }
    } else if (isPlainObject(userkey)) {
      setfn = (value) => {
        // debug(mkey, '=>', userkey)
        target[mkey] = createMappingProps(toPlainObject(value), userkey);
      }
    }
    Object.defineProperty(target, mkey, {
      get: getfn,
      set: setfn,
      enumerable: false,
      configurable: false
    });
  });
  return target;
}

const getRefrences = exports.getRefrences = (fields = [], pname = '') => {
  return fields.reduce((refs, it) => {
    const key = [pname, it.key].filter(it => it).join('.');
    if (it.type === 'reference') {
      return {
        ...refs,
        [key]: it.src
      }
    } else if (it.subtype === 'reference') {
      return {
        ...refs,
        [key + '[]']: it.src
      }
    } else if (it.type === 'object') {
      return {
        ...refs,
        ...getRefrences(it.fields, it.key)
      }
    } else if (it.subtype === 'object') {
      return {
        ...refs,
        ...getRefrences(it.fields, it.key + '[]')
      }
    }
    return refs;
  }, {});
}

const getActions = exports.getActions = (fields) => {
  // 只提取第一级定义
  return fields.filter(it => it.type === 'function');
}

const getPropFields = exports.getPropFields = (fields) => {
  if (fields) {
    fields = fields.filter(it => it.type !== 'function');
    fields.forEach(it => {
      it.fields = getPropFields(it.fields);
    });
  }
  return fields;
}

const exts = {};
const addTypeCreator = exports.addTypeCreator = (type, handle) => {
  exts[type] = handle;
}

const createObject = exports.createObject = (defineObj = {}, fields, opts) => {
  opts = {
    withDefault: false,
    ...opts
  };
  const createDefaultValue = (defValue) => {
    if (opts.withDefault) {
      return defValue;
    }
    return undefined;
  };
  fields.forEach(it => {
    const ext = exts[it.type];
    if (ext) {
      ext(it, defineObj, opts);
    } else {
      switch (it.type) {
      case 'array':
        defineObj[it.key] = createDefaultValue(it.defValue || undefined);
        break;
      case 'reference':
        defineObj[it.key] = undefined;
        break;
      case 'SimpleModel':
      case 'ListModel':
      case 'TableModel':
      case 'FilterModel':
      case 'mixed':
      case 'object':
        const props = createObject({}, it.fields || [], opts);
        // debug(defineObj,{
        //   [it.key]: props
        // },subDecs)
        defineObj[it.key] = props;
        break;
      case 'id':
      case 'string':
        defineObj[it.key] = createDefaultValue(it.defValue !== undefined ? String(it.defValue || '') : undefined);
        break;
      case 'number':
        defineObj[it.key] = createDefaultValue(it.defValue !== undefined ? Number(it.defValue || 0) : undefined);
        break;
      case 'boolean':
        defineObj[it.key] = createDefaultValue(it.defValue !== undefined ? Boolean(it.defValue || false) : undefined);
        break;
      case 'date':
        if (it.defValue === 'now') {
          defineObj[it.key] = createDefaultValue(Date.now);
        } else {
          defineObj[it.key] = createDefaultValue(it.defValue !== undefined ? moment(it.defValue).toDate() : undefined);
        }
        break;
      case 'function':
        // 默认函数定义跳过
        //defineObj[it.key] = it.handle;
        break;
      default:
        defineObj[it.key] = createDefaultValue(it.defValue || undefined);
      }
    }
  });
  return defineObj;
}

const createMapping = exports.createMapping = (fields, name) => {
  const dtom = mapper.createMap('dto', name);
  const mtod = mapper.createMap(name, 'dto');
  //console.log('Type', name, fields);
  fields.forEach(it => {
    switch (it.type) {
    case 'array':
      it.fields && createMapping(it.fields, name + '_' + it.key);
      [dtom, mtod].forEach(atob => {
        atob.forMember(it.key, function () {
          const sourceValue = this.__sourceValue[it.key];
          let destinationValue = this.__destinationValue[it.key];
          const setItemValue = (i, value) => {
            switch (it.subtype) {
            case 'reference':
              if (isPlainObject(value)) {
                // 对象也需要只保留id，要不整个对象都变成差异更新db
                destinationValue[i] = {
                  id: value.id
                };
              } else if (isString(value)) {
                const refVal = {
                  id: value
                }
                //debug(refVal)
                destinationValue[i] = refVal;
              } else if (isNull(value)) {
                destinationValue[i] = null;
              } else if (!isUndefined(value)) {
                const refVal = {
                  id: toString(value)
                }
                //debug(refVal)
                destinationValue[i] = refVal;
              }
              break;
            case 'mixed':
            case 'object':
              if (it.fields) {
                if (!destinationValue[i]) {
                  destinationValue[i] = createObject({}, it.fields);
                }
                if (atob === dtom) {
                  mapper.map('dto', name + '_' + it.key, value, destinationValue[i]);
                } else {
                  mapper.map(name + '_' + it.key, 'dto', value, destinationValue[i]);
                }
              } else {
                destinationValue[i] = toPlainObject(value);
              }
              break;
            case 'id':
            case 'string':
              if (isUndefined(value) || isNull(value)) {
                destinationValue[i] = value;
              } else {
                destinationValue[i] = toString(value);
              }
              break;
            case 'number':
              if (isUndefined(value) || isNull(value)) {
                destinationValue[i] = value;
              } else {
                destinationValue[i] = toNumber(value); // 类型装换
              };
              break;
            case 'boolean':
              if (isUndefined(value) || isNull(value)) {
                destinationValue[i] = value;
              } else {
                destinationValue[i] = val === '0' ? false : !!value; // 类型装换
              };
              break;
            case 'date':
              if (isUndefined(value) || isNull(value)) {
                destinationValue[i] = value;
              } else {
                // 支持字符串自动转换
                destinationValue[i] = moment(value).toDate(); // 类型装换
              }
              break;
            default:
              destinationValue[i] = value;
              break;
            }
          }
          if (isArray(sourceValue)) {
            if (!destinationValue) {
              this.__destinationValue[it.key] = destinationValue = [];
            }
            destinationValue.length = sourceValue.length;
            // 如果是数组就循环赋值
            for (var i = 0; i < sourceValue.length; i += 1) {
              setItemValue(i, sourceValue[i]);
            }
          } else if (!isUndefined(sourceValue)) {
            if (!destinationValue) {
              this.__destinationValue[it.key] = destinationValue = [];
            }
            // 可以是一个对象，直接赋给数组的第一个元素上
            destinationValue.length = 1;
            setItemValue(0, toPlainObject(sourceValue));
          }
        });
      })
      break;
    case 'reference':
      [dtom, mtod].forEach(atob => {
        atob.forMember(it.key, function () {
          let sourceValue = this.__sourceValue[it.key];
          if (isObject(sourceValue)) {
            // 对象也需要只保留id，要不整个对象都变成差异更新db
            this.__destinationValue[it.key] = {
              id: sourceValue.id
            };
          } else if (isString(sourceValue)) {
            const refVal = {
              id: sourceValue
            }
            //debug(refVal)
            this.__destinationValue[it.key] = refVal;
          } else if (isNull(sourceValue)) {
            this.__destinationValue[it.key] = null;
          }
        });
      })
      break;
    case 'mixed':
    case 'object':
      // object的fields未定义表示是mixed任意类型数据
      it.fields && createMapping(it.fields, name + '_' + it.key);
      dtom.forMember(it.key, function () {
        let sourceValue = this.__sourceValue[it.key];
        if (!it.fields) {
          // mixed任意类型数据直接赋值
          this.__destinationValue[it.key] = sourceValue;
          return;
        }
        if (sourceValue) {
          mapper.map('dto', name + '_' + it.key, sourceValue, this.__destinationValue[it.key]);
        } else {

          // 对象支持把层级拉平赋值
          //console.debug(it.key, this.__sourceValue)
          const destinationValue = this.__destinationValue[it.key];
          const sourceKeys = Object.keys(this.__sourceValue);
          // ref引用类型支持
          //debug(it.fields.map(it => it.key));
          const flatValue = {};
          //for (let key in it.fields.map(it => it.key)) {
          // if (!destinationValue.hasOwnProperty(key)) {
          //   continue;
          // }
          // 把当前级别的subkey拉平成一个子对象
          const flatKeys = sourceKeys.filter(key => key.toUpperCase().indexOf(it.key.toUpperCase()) > -1);
          flatKeys.forEach(key => {
            // 这里需要对大小写格式化
            flatValue[camelCase(key.substr(it.key.length))] = this.__sourceValue[key];
          });
          //}

          mapper.map('dto', name + '_' + it.key, flatValue, destinationValue);
        }
      });
      mtod.forMember(it.key, function () {
        let sourceValue = this.__sourceValue[it.key];
        if (!it.fields) {
          // mixed任意类型数据直接赋值
          this.__destinationValue[it.key] = toPlainObject(sourceValue);
          return;
        }
        if (sourceValue) {
          mapper.map(name + '_' + it.key, 'dto', sourceValue, this.__destinationValue[it.key]);
        }
      });
      break;
    case 'id':
    case 'string':
      [dtom, mtod].forEach(atob => atob.forMember(it.key, function () {
        if (this.__sourceValue.hasOwnProperty(it.key)) {
          const val = this.__sourceValue[it.key];
          if (isUndefined(val) || isNull(val)) {
            this.__destinationValue[it.key] = val;
          } else {
            this.__destinationValue[it.key] = toString(val);
          };
        }
      }));
      break;
    case 'number':
      [dtom, mtod].forEach(atob => atob.forMember(it.key, function () {
        if (this.__sourceValue.hasOwnProperty(it.key)) {
          const val = this.__sourceValue[it.key];
          if (isUndefined(val) || isNull(val)) {
            this.__destinationValue[it.key] = val;
          } else {
            this.__destinationValue[it.key] = toNumber(val); // 类型装换
          };
        }
      }));
      break;
    case 'boolean':
      [dtom, mtod].forEach(atob => atob.forMember(it.key, function () {
        if (this.__sourceValue.hasOwnProperty(it.key)) {
          const val = this.__sourceValue[it.key];
          if (isUndefined(val) || isNull(val)) {
            this.__destinationValue[it.key] = val;
          } else {
            this.__destinationValue[it.key] = val === '0' ? false : !!val; // 类型装换
          };
        }
      }));
      break;
    case 'date':
      [dtom, mtod].forEach(atob => atob.forMember(it.key, function () {
        if (this.__sourceValue.hasOwnProperty(it.key)) {
          const val = this.__sourceValue[it.key];
          if (isUndefined(val) || isNull(val)) {
            this.__destinationValue[it.key] = val;
          } else {
            //console.log(it.key,val)
            // 支持字符串自动转换
            this.__destinationValue[it.key] = moment(val).toDate(); // 类型装换
          }
        }
      }));
      break;
    case 'function':
      // 跳过none
      [dtom, mtod].forEach(atob => atob.forMember(it.key, none));
      break;
    default:
      [dtom, mtod].forEach(atob => atob.forMember(it.key, function () {
        if (this.__sourceValue.hasOwnProperty(it.key)) {
          const val = this.__sourceValue[it.key];
          this.__destinationValue[it.key] = val;
        }
      }));
    }
  });
}

const mapto = exports.mapto = mapper.map;

const cutFields = exports.cutFields = (data, fields, cuts) => {
  cuts.forEach(key => {
    delete data[key];
  })
  fields.forEach(it => {
    if (it.type === 'array' && (it.subtype === 'object' || (it.fields && it.fields.length > 0))) {
      data[it.key] && data[it.key].forEach(subdata => {
        cutFields(subdata, it.fields, cuts);
      })
    }
  })
  return data;
}

const evalFunction = exports.evalFunction = (handle, params) => {
  if (isFunction(handle)) {
    debug('eval function...', handle);
    return handle;
  } else if (isString(handle) || isArray(handle)) {
    let fn;
    if (isArray(handle)) {
      if (handle.every(it => it.indexOf('return ') === -1)) {
        fn = handle.map((it, i) => i === handle.length - 1 ? 'return ' + it : it).join('\n');
      } else {
        fn = handle.join('\n');
      }
    } else {
      if (handle.indexOf('return ') === -1) {
        fn = 'return ' + handle;
      } else {
        fn = handle;
      }
    }
    debug('eval function...', fn);
    return new Function(params, fn);
  }
}

const reduceFunction = exports.reduceFunction = (fields) => {
  if (!fields) {
    return fields;
  }
  fields.forEach(it => {
    if (it.handle) {
      it.handle = evalFunction(it.handle, it.arguments);
    } else if (it.rules && it.rules.validator) {
      it.rules.validator = evalFunction(it.rules.validator, it.rules.arguments || 'rule, value, source, options, context');
    }
  });
  return fields;
}

exports.Schema = class Schema {
  // 要是json直接new，要是jsschema调用create里new
  constructor(
    type,
    fields,
    conflicts,
    mappings,
    references,
    actions,
    syskeys) {
    this.type = type;
    // 需要把json定义的函数转成function
    this.fields = reduceFunction(fields);
    this.conflicts = conflicts;
    this.mappings = mappings;
    this.references = references;
    this.actions = actions;
    this.syskeys = syskeys;
  }

  static create(BaseType, schema) {
    const defFields = getMeta(BaseType.fields, BaseType.types);
    let fields = getMeta(schema, BaseType.types);
    const mappings = getFieldMapings(fields, defFields);
    // 检查是否有字段缺失
    const {
      defectFields,
      errFields
    } = checkRequiredFieldMap(defFields, mappings, fields);
    if (errFields.length > 0) {
      debug(errFields)
      throw new Error(i18n.t('{{entityName}}类型数据缺少必要字段{{fields}}，或者{{checkKeys}}字段配置信息冲突', {
        entityName: BaseType.name,
        fields: getKeyPaths(errFields).join(','),
        checkKeys: checkKeys.join(',')
      }));
    }
    // 缺失字段要是能补全自动补充
    if (defectFields.length > 0) {
      fields = unionFields(fields, defectFields);
    }
    // 检查是否有系统字段冲突情况
    const conflicts = fields.filter(it => {
      return BaseType.syskeys.some(key => it.key === key);
    });

    const actions = getActions(fields);
    const propFields = getPropFields(fields);
    const references = getRefrences(propFields);

    //debug(sche)
    return new Schema(
      BaseType.name,
      propFields,
      conflicts,
      mappings,
      references,
      actions,
      BaseType.syskeys
    );
  }

  // 创建一个数据对象
  createObject(opts = {}) {
    return createObject({}, this.fields, opts);
  }

  createMapping(key) {
    this.key = key;
    createMapping(this.fields, key);
  }

  // 拷贝数据到m
  maptoModel(dto, m) {
    if (!this.key) {
      throw new Error(i18n.t('无法复制到模型, 映射关系尚未创建'));
    }
    mapper.map('dto', this.key, dto, m);
  }

  // 提取数据到dto
  maptoDto(m, dto) {
    if (!this.key) {
      throw new Error(i18n.t('无法复制到传输对象, 映射关系尚未创建'));
    }
    mapper.map(this.key, 'dto', m, dto);
  }

  // 给对象添加内置字段的get和set的属性
  createMappingProps(obj) {
    return createMappingProps(obj, this.mappings);
  }

  cutFields(obj) {
    return cutFields(obj, this.fields, this.syskeys);
  }

  // 暂时不提供验证服务, 一般有第三方提供了, 会重复校验
  // async validate(data, opts = {}) {}
}
