const { Model } = require('./Model');

exports.Schedule = class Schedule {
  static create(
    name,
    { year, month, date, dayOfWeek, hour, minute, second },
    job,
    { command, data },
    options
  ) {
    this.name = name;
    this.spec = { year, month, date, dayOfWeek, hour, minute, second };
    this.action = { command, data };
    this.job =
      typeof job === 'string'
        ? { job }
        : job instanceof Model
        ? { job: job.name }
        : { job: job.job, params: job.params };
    this.options = options;
  }
};
