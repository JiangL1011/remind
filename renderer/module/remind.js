/**
 author  蒋领
 date    2019年05月12日
 */
const remindDB = require('../dao/remind');

$(function () {
    const today = window.moment().format('YYYYMMDD');
    const now = window.moment().valueOf();
    remindDB.getByRangeDate(today, today, function (data) {
        const reminds = data[today];
        for (const remind of reminds) {
            const detail = remind.detail[today];
            if (!detail || !detail.reminded) {
                let remindTimestamp = window.moment(remind.remindTime, 'YYYYMMDDHHmmss').valueOf();
                if (detail && detail.delay) {
                    remindTimestamp += (detail.delay * 60000);
                }
                const fromNow = remindTimestamp - now;
                if (fromNow >= 0 && fromNow <= 3600000) {
                    const where = {_id: remind._id};
                    const set = {['detail.' + today + '.reminded']: true};
                    const type = 'set';
                    remindDB.update(where, set, type, function (backData) {
                        if (backData) {
                            send('doRemind', [remind.title, remind.content, remindTimestamp]);
                        }
                    });

                }
            }
        }
    });
});