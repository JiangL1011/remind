/**
 author:  JiangL
 date:    2019年04月21日
 */
const Nedb = require('nedb');
const communicate = require('../util/communicate');
const moment = require('moment');

const todayJobs = [];
let updateTodayJobs = false;

const db = new Nedb({
    filename: 'data/remind.db',
    autoload: true
});

communicate.receive('submit-new-remind', function (event, data) {
    for (let i = 0; i < data.length; i++) {
        // 如果新增的任务是当天的，则修改参数，使报警定时器重新获取当天任务
        const createDate = moment(data[i].createTime, 'YYYYMMDDHHmmss').format('YYYYMMDD');
        if (createDate === moment().format('YYYYMMDD')) {
            updateTodayJobs = true;
        }
        db.insert(data[i], function (err, newDoc) {
            if (i === data.length - 1 || err) {
                event.sender.send('submit-new-remind', !err);
            }
        });
    }
});

communicate.receive('getRemindsByDay', function (event, data) {
    // 接收到的参数均为YYYYMMDD格式的日期
    // 这里参数是一天的时间，因此开始和结束日期是一样的
    const start = parseInt(data);
    const end = parseInt(data);

    // 记录所有选定范围内的任务
    const arr = [];
    db.find({
        $where: function () {
            return findData(this, arr, start, end);
        }
    }, function (err, docs) {
        arr.sort((a, b) => {
            if (a.remindTime !== b.remindTime) {
                return a.remindTime < b.remindTime ? -1 : 1;
            } else {
                return a.priority <= b.priority ? -1 : 1;
            }
        });
        event.sender.send('getRemindsByDay', arr);
    });
});

communicate.receive('loadTimeline', function (event, data) {
    // 接收到的参数均为YYYYMMDD格式的日期
    const start = parseInt(data[0]);
    const end = parseInt(data[1]);

    // 记录所有选定范围内的任务
    const arr = [];
    db.find({
        $where: function () {
            return findData(this, arr, start, end);
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

// 用于报警定时器获取当天的任务
const findRemindsToday = function (callBack) {
    if (todayJobs.length > 0 && !updateTodayJobs) {
        callBack(todayJobs);
    }

    const today = parseInt(moment().format('YYYYMMDD'));
    db.find({
        $where: function () {
            return findData(this, todayJobs, today, today);
        }
    }, function (err, docs) {
        todayJobs.sort((a, b) => {
            if (a.remindTime !== b.remindTime) {
                return a.remindTime < b.remindTime ? -1 : 1;
            } else {
                return a.priority <= b.priority ? -1 : 1;
            }
        });
        updateTodayJobs = false;
        callBack(todayJobs);
    });
};

const findData = function (candidateData, arr, start, end) {
    if (candidateData.type === 'once') {
        const deadDate = parseInt(candidateData.deadline.substring(0, 8));
        if (deadDate >= start && deadDate <= end) {
            candidateData.remindTime = parseInt(candidateData.deadline);
            arr.push({...candidateData});
        }
    } else {
        if (candidateData.interval === 'everyDay') {
            let i = 0;
            const createTime = parseInt(moment(candidateData.createTime, 'YYYYMMDDHHmmss').format('YYYYMMDD'));
            while (true) {
                const d = parseInt(moment(start, 'YYYYMMDD').add(i, 'd').format('YYYYMMDD'));
                if (d <= end) {
                    if (d >= createTime && d >= start) {
                        candidateData.remindTime = parseInt(d + '' + candidateData.repeatTime);
                        arr.push({...candidateData});
                    }
                } else {
                    break;
                }
                i++;
            }
        } else if (candidateData.interval === 'everyMonth') {
            let i = 0;
            const dayOfMonth = parseInt(candidateData.dayOfMonth);
            // 从起始日期的所在月份开始遍历
            const startMonth = start - start % 100 + dayOfMonth;
            const createTime = parseInt(moment(candidateData.createTime, 'YYYYMMDDHHmmss').format('YYYYMMDD'));
            while (true) {
                const d = parseInt(moment(startMonth, 'YYYYMMDD').add(i, 'M').format('YYYYMMDD'));
                if (d <= end) {
                    if (d >= createTime && d >= start) {
                        candidateData.remindTime = parseInt(d + '' + candidateData.repeatTime);
                        arr.push({...candidateData});
                    }
                } else {
                    break;
                }
                i++;
            }
        } else if (candidateData.interval === 'everyWeek') {
            let dayOfWeek = parseInt(candidateData.dayOfWeek);
            const createTime = parseInt(moment(candidateData.createTime, 'YYYYMMDDHHmmss').format('YYYYMMDD'));
            while (true) {
                const d = parseInt(moment().day(dayOfWeek).format('YYYYMMDD'));
                if (d <= end) {
                    if (d >= createTime && d >= start) {
                        candidateData.remindTime = parseInt(d + '' + candidateData.repeatTime);
                        arr.push({...candidateData});
                    }
                } else {
                    break;
                }
                dayOfWeek += 7;
            }
        }
    }
    return false;
};

module.exports = {
    jobsToday: findRemindsToday
};
