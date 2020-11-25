const {
    expect
} = require('chai');
const {
    Schedule,
    Job
} = require('../lib');

describe('计划任务', () => {

    it('定义一个计划任务', () => {
        const CustomJob = Job('CustomJob');

        const CustomSchedule = Schedule(
            'CustomSchedule',
            {
                second: 3,
            },
            CustomJob
        );

        expect(CustomJob.name).to.be.eql('CustomJob');
        expect(CustomSchedule.name).to.be.eql('CustomSchedule');
        expect(CustomSchedule.spec).to.be.eql({
            year: undefined, month: undefined, date: undefined,
            dayOfWeek: undefined, hour: undefined, minute: undefined, second: 3
        });
        expect(CustomSchedule.action).to.be.eql({ command: undefined, data: undefined })
        expect(CustomSchedule.job.name).to.be.eql('CustomJob')
        expect(CustomSchedule.options).to.be.eql(undefined)
    })
})
