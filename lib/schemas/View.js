const keys = require('lodash/keys');
const mapValues = require('lodash/mapValues');
const isArray = require('lodash/isArray');
const mapKeys = require('lodash/mapKeys');
const omitBy = require('lodash/omitBy');
const trimStart = require('lodash/trimStart');
const isString = require('lodash/isString');
const isPlainObject = require('lodash/isPlainObject');
const merge = require('lodash/merge');
const jxon = require('jxon');
// const Ajv = require('ajv');
const i18n = require('../i18n');
const debug = require('debug')('saas-plat:View');

const omitEmptyObj = obj => {
  return mapValues(obj, v => {
    if (isPlainObject(v)) {
      if (keys(v).length === 0) {
        return undefined;
      }
      return omitEmptyObj(v);
    } else if (isArray(v)) {
      return v.map(omitEmptyObj).filter(it => it);
    } else {
      return v;
    }
  })
}

const loadReduce = ({
  key,
  type,
  bind,
  items,
  ...props
}, viewModelSchema, keyGenerator) => {
  if (!type) {
    debug('not support node', props);
    return null;
  }
  // debug('parse', type);
  // 需要把bind字段视图状态字段生成出来
  if (bind && viewModelSchema) {
    const subSchema = viewModelSchema[bind];
    if (!subSchema) {
      if (process.env.NODE_ENV === 'test') {
        debug(viewModelSchema)
        throw new Error('bind ' + bind + ' not found!')
      }
      debug('bind %s not found!', bind);
      bind = null;
    }
  }
  // onXXX 是行为定义，需要转出固定格式，
  // 要是不需要转换格式，加$onXXX
  props = mapValues(props, (val, key) => {
    if (key.startsWith('on')) {
      if (isString(val)) {
        return {
          name: val,
          args: {}
        }
      } else if (isPlainObject(val)) {
        const {
          type,
          name,
          args,
          ...other
        } = val;
        return {
          name,
          args: {
            ...other,
            ...args
          }
        }
      } else if (isArray(val)) {
        return val.map(subval => {
          if (isString(subval)) {
            return {
              name: subval,
              args: {}
            }
          } else if (isPlainObject(subval)) {
            const {
              type,
              name,
              args,
              ...other
            } = subval;
            return {
              name,
              args: {
                ...other,
                ...args
              }
            }
          }
        })
      }
    } else {
      return val;
    }
  })

  // $是不转换标识，需要过滤掉
  props = mapKeys(props, (v, key) => trimStart(key, '$'));
  items = items && items.map(it => loadReduce(it, viewModelSchema, keyGenerator)).filter(it => it);
  if (items && items.length === 0) {
    items = undefined;
  }
  return {
    key: key || (keyGenerator ? (type + keyGenerator.key++) : undefined),
    type,
    bind,
    ...omitEmptyObj(props),
    items
  }
}

const loadJson = exports.loadJson = (template, viewModelSchema, keyGenerator) => {

  // 这个功能应该放到开发社区
  // const valid = ajv.validate(require('./' + platform+'.json'), template);
  // if (!valid) {
  //   debug(ajv.errors);
  // }
  return loadReduce(template, viewModelSchema, keyGenerator);
}

const sameKey = (ret, src) => {
  if (src.key) {
    return src.key === ret.key;
  } else if (src.type) {
    return src.type === ret.type;
  }
  return false;
}

// 模板合并，要是user模板没有的key就是删除，要是数据追加到user的items后边
const mergeTemplate = exports.mergeTemplate = (template, user) => {
  if (!template) {
    return user;
  }
  if (sameKey(template, user)) {
    const retitems = [];
    if (user.items) {
      retitems.push(...user.items.map(it => mergeTemplate((template.items || []).find(sit => sameKey(sit, it)), it)));
    }
    if (template.items) {
      retitems.push(...template.items.filter(it => !user.items.every(rit => sameKey(rit, it))));
    }
    const {
      key,
      items,
      ...props
    } = user;
    return {
      key,
      ...merge(template, props),
      items: retitems
    }
  } else {
    return user;
  }
}

exports.loadJxon = (strxml) => {
  if (!strxml) {
    return null;
  }
  jxon.config({
    valueKey: 'text',
    // attrKey: '$',
    attrPrefix: '',
    // lowerCaseTags: false,
    // trueIsEmpty: false,
    // autoDate: false,
    // ignorePrefixedNodes: false,
    // parseValues: false
  })
  const formatNode = (node) => {
    if (node.parentNode && node.nodeType === 1) {
      // 节点名称是type类型
      const attr = node.ownerDocument.createAttribute('type');
      attr.value = node.nodeName;
      node.setAttributeNode(attr);
      // 所有子节点都是items数组
      node.nodeName = 'items';
    }
    if (node.hasChildNodes()) {
      for (let i = 0; i < node.childNodes.length; i++) {
        formatNode(node.childNodes.item(i));
      }
    }
    return node;
  }

  var xml = jxon.stringToXml(strxml);
  formatNode(xml.documentElement);
  return jxon.xmlToJs(xml).items;
}

exports.View = class View {

  constructor(name, root) {
    this.name = name;
    this.root = root;
  }

  static create(name, Template, template, viewModelSchema = null) {
    const keyGenerator = {
      key: 1
    };
    const root = loadJson(mergeTemplate(Template, template), viewModelSchema, keyGenerator);
    return new View(name, root);
  }
}
