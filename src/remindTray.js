/**
 author  蒋领
 date    2019年04月30日
 */
const remind = require('./database/remind.js');
const moment = require('moment');
const detail = require('./database/detail');

module.exports = {
    load: function (tray, env) {

        setInterval(function () {
            remind.jobsToday(function (data) {
                const currTime = parseInt(moment().format('HHmmss'));
                if (data.length > 0) {
                    for (const d of data) {
                        const remindTime = parseInt(d.deadline ? (moment(d.deadline, 'YYYYMMDDHHmmss').format('HHmmss')) : d.repeatTime);
                        detail.reminded(d._id, moment().format('YYYYMMDD'), function (reminded) {
                            if (!reminded) {
                                // 提前15分钟预警
                                const fromNow = remindTime - currTime;
                                if (fromNow <= 1500 && fromNow >= 0) {
                                    tray.displayBalloon({
                                        title: '还有15分钟！！！',
                                        content: d.title + '\r\n' + d.content,
                                        icon: env + 'static/img/lufi.jpg'
                                    });
                                }
                            }
                        });
                    }
                }
            });

        }, 1000);
    }
};