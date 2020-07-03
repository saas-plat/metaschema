export default class EntitySchema {
  constructor(fields,
    conflicts,
    mappings,
    references,
    propFields,
    actions) {
    this.fields = fields;
    this.conflicts = conflicts;
    this.mappings = mappings;
    this.references = references;
    this.propFields = propFields;
    this.actions = actions;
  }

  static createSchame(BaseType, schame) {
    // 支持mapping字段对必要字段映射
    const defFields = getMeta(BaseType.fields, entityTypes);
    let fields = getMeta(schame, entityTypes);
    const mappings = getFieldMapings(fields, defFields);
    // 检查是否有字段缺失
    const {
      defectFields,
      errFields
    } = checkRequiredFieldMap(defFields, mappings, fields);
    if (errFields.length > 0) {
      debug(errFields)
      throw new Error(t('{{name}}类型实体缺少必要字段{{fields}}，或者{{checkKeys}}字段配置信息冲突', {
        name: BaseType.name,
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
    const references = getRefrences(fields);
    const actions = getActions(fields);
    const propFields = getPropFields(fields);
    return new EntitySchema(
      fields,
      conflicts,
      mappings,
      references,
      propFields,
      actions
    );
  }
}
