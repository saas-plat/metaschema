const _mapValues = require('lodash/mapValues');
const _isArray = require('lodash/isArray');
const _mapKeys = require('lodash/mapKeys');
const _trimStart = require('lodash/trimStart');
const _isString = require('lodash/isString');
const _isPlainObject = require('lodash/isPlainObject');
const jxon = require('jxon');
// const Ajv = require('ajv');
const i18n = require('./i18n');

const loadReduce = ({
  type,
  bind,
  items,
  ...props
}, viewModelSchema = {}) => {
  if (!type) {
    console.log('not support node', props);
    return null;
  }
  // debug('parse', type);
  // 需要把bind字段视图状态字段生成出来
  if (bind) {
    const subSchema = viewModelSchema[bind];
    if (!subSchema) {
      if (process.env.NODE_ENV === 'test') {
        console.log(viewModelSchema)
        throw new Error('bind ' + bind + ' not found!')
      }
      console.log('bind %s not found!', bind);
      bind = null;
    }
  }
  // onXXX 是行为定义，需要转出固定格式，
  // 要是不需要转换格式，加$onXXX
  props = _mapValues(props, (val, key) => {
    if (key.startsWith('on')) {
      if (_isString(val)) {
        return {
          type: 'SimpleModel',
          name: val,
          args: {}
        }
      } else if (_isPlainObject(val)) {
        const {
          type,
          name,
          args,
          ...other
        } = val;
        return {
          type: type || 'SimpleModel',
          name,
          args: {
            ...other,
            ...args
          }
        }
      }
    } else {
      return val;
    }
  })

  // $是不转换标识，需要过滤掉
  props = _mapKeys(props, (v, key) => _trimStart(key, '$'));

  return {
    type,
    bind,
    ...props,
    items: items && items.map(it => loadReduce(it, viewModelSchema)).filter(it => it)
  }
}

const loadJson = exports.loadJson = (template, viewModelSchema) => {

  // 这个功能应该放到开发社区
  // const valid = ajv.validate(require('./' + platform+'.json'), template);
  // if (!valid) {
  //   debug(ajv.errors);
  // }
  return loadReduce(template, viewModelSchema);
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

  constructor(type, bind, props, items) {
    if (!type) {
      throw new Error(i18n.t('组件类型未定义'));
    }
    this.type = type;
    this.bind = bind;
    this.props = props;
    this.items = items;
  }

  static create(Template, template, viewModelSchema = {}) {
    // todo 合并基础视图模板 Template.view
    if (Template){

    }
    const {
      type,
      bind,
      items,
      ...props
    } = loadJson(template, viewModelSchema);
    return new View(type, bind, props, items);
  }
}
