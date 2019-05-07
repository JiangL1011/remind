/**
 author  蒋领
 date    2019年04月30日
 */
const badge = require('../util/badge');

module.exports = {
    // 参数为YYYYMMDD格式的日期
    load: function (date) {
        date = date.replace(/\D*/g, '');
        send('getRemindsByDay', [date, date], function (event, data) {
            let html = '';
            for (let i = 0; i < data.length; i++) {
                const time = window.moment(data[i].remindTime, 'YYYYMMDDHHmmss').format('HH:mm:ss');
                const title = data[i].title;
                html += '<div class="remind-item remind">';
                html += '<p class="remind-id" hidden>' + data[i]._id + '</p>';
                html += (time + '&nbsp;' + title);
                html += badge.priorityBadge(data[i].priority);
                html += badge.intervalBadge(data[i].interval, data[i].dayOfMonth);
                html += '<hr class="layui-bg-gray">';
                html += '</div>';
            }
            $('#remind-list').html(html);
        })
    }
};