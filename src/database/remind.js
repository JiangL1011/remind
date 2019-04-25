/**
 author:  JiangL
 date:    2019年04月21日
 */
const Nedb = require('nedb');
const communicate = require('../util/communicate');
const moment = require('moment');

const db = new Nedb({
    filename: 'data/remind.db',
    autoload: true
});

communicate.receive('submit-new-remind', function (event, data) {
    for (let i = 0; i < data.length; i++) {
        db.insert(data[i], function (err, newDoc) {
            if (i === data.length - 1 || err) {
                event.sender.send('submit-new-remind', !err);
            }
        });
    }
});

communicate.receive('loadTimeline', function (event, data) {
    // 接收到的参数均为YYYYMMDD格式的日期
    const start = parseInt(data[0]);
    const end = parseInt(data[1]);

    // 记录所有选定范围内的任务
    const arr = [];

    db.find({
        $where: function () {
            if (this.type === 'once') {
                const deadDate = parseInt(this.deadline.substring(0, 8));
                if (deadDate >= start && deadDate <= end) {
                    this.remindTime = this.deadline;
                    arr.push(this);
                }
            } else {
                if (this.interval === 'everyDay') {
                    while (true) {

                    }
                } else if (this.interval === 'everyMonth') {
                    let date = parseInt(moment().date(this.dayOfMonth).format('YYYYMMDD'));
                    let i = 1;
                    while (true) {
                        date = parseInt(moment(date, 'YYYYMMDD').add(i, 'M').format('YYYYMMDD'));
                        i++;
                        if (date >= start && date <= end) {

                        }
                    }
                }
            }
        }
    }, function (err, docs) {

        event.sender.send('loadTimeline', arr);
    });
});

