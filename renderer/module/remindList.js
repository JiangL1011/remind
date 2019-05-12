/**
 author  蒋领
 date    2019年04月30日
 */
const badge = require('../util/badge');
const remindDB = require('../dao/remind');

let remindDate;
let pTags;
module.exports = {
    // 参数为YYYYMMDD格式的日期
    load: function (date) {
        remindDate = date.replace(/\D*/g, '');
        remindDB.getByRangeDate(remindDate, remindDate, function (data) {
            data = data[remindDate];
            if (!data) {
                data = [];
            }
            let html = '';
            for (let i = 0; i < data.length; i++) {
                const time = window.moment(data[i].remindTime, 'YYYYMMDDHHmmss').format('HH:mm:ss');
                const title = data[i].title;
                html += '<div class="remind-item remind">';
                html += '<p class="remind-id" hidden>' + data[i]._id + '</p>';
                if (data[i].detail[remindDate]
                    && data[i].detail[remindDate].delay
                    && data[i].detail[remindDate].delay !== '0') {
                    const time_ = window.moment(time, 'HH:mm:ss').add('minutes', data[i].detail[remindDate].delay).format('HH:mm:ss');
                    html += '<span class="remind-title delayed"><span>' + time_
                        + '</span>&nbsp;<span>' + title + '</span></span>';
                } else {
                    html += '<span class="remind-title"><span>' + time
                        + '</span>&nbsp;<span>' + title + '</span></span>';
                }
                html += badge.priorityBadge(data[i].priority);
                html += badge.intervalBadge(data[i].interval, data[i].dayOfMonth);
                html += '<hr class="layui-bg-gray">';
                html += '</div>';
            }
            $('#remind-list').html(html);
        });
    }
};