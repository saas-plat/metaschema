export default class EntitySchema {
  static createSchema(BaseTable, meta) {
    const defFields = getMeta(BaseTable.fields, tableTypes);
    let fields = getMeta(meta, tableTypes);
    const mappings = getFieldMapings(fields, defFields);
    // 检查是否有字段缺失
    const {
      defectFields,
      errFields
    } = checkRequiredFieldMap(defFields, mappings, fields);
    if (errFields.length > 0) {
      debug(errFields)
      throw new Error(i18n.t('{{entityName}}类型数据缺少必要字段{{fields}}，或者{{checkKeys}}字段配置信息冲突', {
        entityName: BaseTable.name,
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
      return syskeys.some(key => it.key === key);
    });

    const actions = getActions(fields);
    const propFields = getPropFields(fields);
    const sche = createDbSchema(propFields);
    sche._ns = {
      type: String,
      index: true,
    }
    const references = getRefrences(propFields);
    if (!sche) {
      throw new Error(i18n.t('查询Schema加载失败'));
    }
    const schema = new mongoose.Schema(sche, defOptions);
    //debug(sche)
    return {
      fields,
      schema,
      conflicts,
      mappings,
      references,
      actions,
      propFields
    };
  }
}
