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
            tray.displayBalloon({
                title: '剩余 ' + moment(data[2]).fromNow(true),
                content: data[0] + '\r\n' + data[1],
                icon: env + 'static/img/lufi.jpg'
            });
        });

    }
};