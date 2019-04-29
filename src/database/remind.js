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
                    this.remindTime = parseInt(this.deadline);
                    arr.push({...this});
                }
            } else {
                if (this.interval === 'everyDay') {
                    let i = 0;
                    const createTime = parseInt(moment(this.createTime, 'YYYYMMDDHHmmss').format('YYYYMMDD'));
                    while (true) {
                        const d = parseInt(moment(start, 'YYYYMMDD').add(i, 'd').format('YYYYMMDD'));
                        if (d <= end) {
                            if (d >= createTime && d >= start) {
                                this.remindTime = parseInt(d + '' + this.repeatTime);
                                arr.push({...this});
                            }
                        } else {
                            break;
                        }
                        i++;
                    }
                } else if (this.interval === 'everyMonth') {
                    let i = 0;
                    const dayOfMonth = parseInt(this.dayOfMonth);
                    // 从起始日期的所在月份开始遍历
                    const startMonth = start - start % 100 + dayOfMonth;
                    const createTime = parseInt(moment(this.createTime, 'YYYYMMDDHHmmss').format('YYYYMMDD'));
                    while (true) {
                        const d = parseInt(moment(startMonth, 'YYYYMMDD').add(i, 'M').format('YYYYMMDD'));
                        if (d <= end) {
                            if (d >= createTime && d >= start) {
                                this.remindTime = parseInt(d + '' + this.repeatTime);
                                arr.push({...this});
                            }
                        } else {
                            break;
                        }
                        i++;
                    }
                } else if (this.interval === 'everyWeek') {
                    let dayOfWeek = parseInt(this.dayOfWeek);
                    const createTime = parseInt(moment(this.createTime, 'YYYYMMDDHHmmss').format('YYYYMMDD'));
                    while (true) {
                        const d = parseInt(moment().day(dayOfWeek).format('YYYYMMDD'));
                        if (d <= end) {
                            if (d >= createTime && d >= start) {
                                this.remindTime = parseInt(d + '' + this.repeatTime);
                                arr.push({...this});
                            }
                        } else {
                            break;
                        }
                        dayOfWeek += 7;
                    }
                }
            }
            return false;
        }
    }, function (err, docs) {
        arr.sort((a, b) => {
            if (a.remindTime !== b.remindTime) {
                return a.remindTime < b.remindTime ? -1 : 1;
            } else {
                return a.priority <= b.priority ? -1 : 1;
            }
        });

        // 把所有提醒任务按照提醒时间分类
        const result = {};
        for (const d of arr) {
            const date = moment(d.remindTime, 'YYYYMMDDHHmmss').format('YYYYMMDD');
            if (!result[date]) {
                result[date] = [];
            }
            result[date].push(d);
        }

        event.sender.send('loadTimeline', result);
    });
});

