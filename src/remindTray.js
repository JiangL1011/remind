/**
 author  蒋领
 date    2019年04月30日
 */
const moment = require('moment');
const communicate = require('./util/communicate');

moment.locale('zh-cn');

module.exports = {
    load: function (tray, env) {
        communicate.receive('doRemind', function (event, data) {
            console.log(data);
        });

        /*setInterval(function () {
            remind.jobsToday(function (data) {
                const nowTimestamp = moment().valueOf();
                if (data.length > 0) {
                    for (const d of data) {
                        const remindTime = parseInt(d.deadline ? (moment(d.deadline, 'YYYYMMDDHHmmss').format('HHmmss')) : d.repeatTime);
                        detail.reminded(d._id, moment().format('YYYYMMDD'), function (backData) {
                            if (!backData.reminded) {
                                // 提前60分钟预警
                                const remindTimestamp = moment(remindTime, 'HHmmss').valueOf();
                                let fromNow = remindTimestamp - nowTimestamp;
                                if (backData.delay) {
                                    fromNow += (backData.delay * 60 * 1000);
                                }
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

        }, 1000);*/
    }
};