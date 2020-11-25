exports.Job = class Job {
  static create(name, options) {
    this.name = name;
    this.options = options;
  }
};
