const { Model } = require('./Model');

exports.Schedule = class Schedule {
  constructor(name, spec, action, job, options) {
    this.name = name;
    this.spec = spec;
    this.action = action;
    this.job = job;
    this.options = options;
  }

  static create(
    name,
    { year, month, date, dayOfWeek, hour, minute, second } = {},
    job = {},
    { command, data } = {},
    options
  ) {
    const spec = { year, month, date, dayOfWeek, hour, minute, second };
    const action = { command, data };
    const jobs =
      typeof job === 'string'
        ? { job }
        : job instanceof Model
          ? { name: job.name }
          : { name: job.job, params: job.params };
    return new Schedule(name, spec, action, jobs, options)
  }
};
