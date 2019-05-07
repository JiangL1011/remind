/**
 author  蒋领
 date    2019年04月30日
 */
const remind = require('./database/remind.js');
const moment = require('moment');
const detail = require('./database/detail');

moment.locale('zh-cn');

module.exports = {
    load: function (tray, env) {

        setInterval(function () {
            remind.jobsToday(function (data) {
                const nowTimestamp = moment().valueOf();
                if (data.length > 0) {
                    for (const d of data) {
                        const remindTime = parseInt(d.deadline ? (moment(d.deadline, 'YYYYMMDDHHmmss').format('HHmmss')) : d.repeatTime);
                        detail.reminded(d._id, moment().format('YYYYMMDD'), function (reminded) {
                            if (!reminded) {
                                // 提前15分钟预警
                                const remindTimestamp = moment(remindTime, 'HHmmss').valueOf();
                                const fromNow = remindTimestamp - nowTimestamp;
                                if (fromNow <= 60 * 60 * 1000 && fromNow >= 0) {
                                    tray.displayBalloon({
                                        title: moment(remindTime, 'HHmmss').fromNow(true),
                                        content: d.title + '\r\n' + d.content,
                                        icon: env + 'static/img/lufi.jpg'
                                    });
                                    detail.remind(d._id, moment().format('YYYYMMDD'));
                                }
                            }
                        });
                    }
                }
            });

        }, 1000);
    }
};