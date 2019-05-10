/**
 author  蒋领
 date    2019年05月10日
 */
const Nedb = require('nedb');
const db = new Nedb({
    filename: 'data/remind.db',
    autoload: true
});

module.exports = {
    add: function (reminds, callback) {
        db.insert(reminds, function (err) {
            callback(!err);
        });
    },
    getByRangeDate: function (start, end, callback) {
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

            callback(result);
        });
    }
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
            const createTime = parseInt(window.moment(candidateData.createTime, 'YYYYMMDDHHmmss').format('YYYYMMDD'));
            while (true) {
                const d = parseInt(window.moment(start, 'YYYYMMDD').add(i, 'd').format('YYYYMMDD'));
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
            const createTime = parseInt(window.moment(candidateData.createTime, 'YYYYMMDDHHmmss').format('YYYYMMDD'));
            while (true) {
                const d = parseInt(window.moment(startMonth, 'YYYYMMDD').add(i, 'M').format('YYYYMMDD'));
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
            const createTime = parseInt(window.moment(candidateData.createTime, 'YYYYMMDDHHmmss').format('YYYYMMDD'));
            while (true) {
                const d = parseInt(window.moment().day(dayOfWeek).format('YYYYMMDD'));
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