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
    db.insert(data, function (err, newDoc) {
        event.sender.send('submit-new-remind', !err);
    });
});

communicate.receive('loadTimeline', function (event, data) {
    // 接收到的参数均为YYYYMMDD格式的日期
    const start = parseInt(data[0]);
    const end = parseInt(data[1]);

    db.find({
        $where: function () {
            if (this.type === 'repeat') {
                // Nedb内部应该是有个缓存，所以只要查询过一次，则数据中就会有nextRemind字段
                // 所以每次需要将这个字段清空
                this.nextRemind = [];
                // 如果是重复提醒，则判断下一次提醒是否在end之前，如果是则返回数据
                if (this.interval === 'everyDay') {
                    let m = moment(start, 'YYYYMMDD');
                    while (true) {
                        this.nextRemind.push(parseInt(m.format('YYYYMMDD')));
                        m = m.add(1, 'days');
                        if (parseInt(m.format('YYYYMMDD')) > end) {
                            break;
                        }
                    }
                    this.nextRemind.sort(function (a, b) {
                        return a <= b ? -1 : 1
                    });
                    return true;
                } else if (this.interval === 'everyWeek') {
                    for (let key in this) {
                        if (!/^[we{2}k]/.test(key)) {
                            continue;
                        }
                        let dayOfWeek = parseInt(/\d/.exec(key)[0]);
                        while (true) {
                            const dateNum = parseInt(moment().day(dayOfWeek).format('YYYYMMDD'));
                            if (dateNum < start) {
                                dayOfWeek += 7;
                            } else if (dateNum > end) {
                                break;
                            } else {
                                this.nextRemind.push(dateNum);
                                dayOfWeek += 7;
                            }
                        }
                    }
                    this.nextRemind.sort(function (a, b) {
                        return a <= b ? -1 : 1
                    });
                    return this.nextRemind !== undefined && this.nextRemind.length > 0;
                } else {
                    let dayOfMonth = parseInt(this.dayOfMonth);
                    let startMonth = Math.floor(start % 10000 / 100);
                    while (true) {
                        const dateNum = parseInt(moment().month(startMonth - 1).date(dayOfMonth).format('YYYYMMDD'));
                        if (dateNum < start) {
                            startMonth++;
                        } else if (dateNum > end) {
                            break;
                        } else {
                            this.nextRemind.push(dateNum);
                            startMonth++;
                        }
                    }
                    this.nextRemind.sort(function (a, b) {
                        return a <= b ? -1 : 1
                    });
                    return this.nextRemind !== undefined && this.nextRemind.length > 0;
                }
            } else {
                const deadline = parseInt(moment(this.deadline, 'YYYY-MM-DD hh:mm:ss').format('YYYYMMDD'));
                return deadline >= start && deadline <= end;
            }
        }
    }, function (err, docs) {
        // 根据nextRemind中的日期将数据拆分，并按照remindDate排序以便前端遍历展示时间线
        const arr = [];
        for (let i = 0; i < docs.length; i++) {
            const data = docs[i];
            if (data.deadline) {
                data.remindDate = parseInt(moment(data.deadline, 'YYYY-MM-DD hh:mm:ss').format('YYYYMMDD'));
                arr.push({...data});
            } else {
                for (let j = 0; j < data.nextRemind.length; j++) {
                    data.remindDate = data.nextRemind[j];
                    delete data._id;
                    arr.push({...data});
                }
            }
        }
        arr.sort(function (a, b) {
            if (a.remindDate < b.remindDate) {
                return -1;
            } else if (a.remindDate > b.remindDate) {
                return 1;
            } else if (a.repeatTime < b.repeatTime) {
                return -1;
            } else if (a.repeatTime > b.repeatTime) {
                return 1;
            } else if (a.priority === b.priority) {
                const x = a.interval === 'everyDay' ? 1 : (a.interval === 'everyWeek' ? 2 : 3);
                const y = b.interval === 'everyDay' ? 1 : (b.interval === 'everyWeek' ? 2 : 3);
                return x <= y ? -1 : 1;
            } else {
                return a.priority < b.priority ? 1 : -1;
            }
        });

        event.sender.send('loadTimeline', arr);
    });
});

