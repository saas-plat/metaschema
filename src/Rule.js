// 解析对象格式的Constraints
export const parseObjctRule = (obj) => {

}

export default class Rule {
  constructor(name, when, then) {
    this.name = name;
    this.when = when;
    this.then = then;
  }

  static create({
    name,
    when,
    then
  }) {
    return new Rule(name, when, then);
  }
}
