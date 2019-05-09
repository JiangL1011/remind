/**
 author  蒋领
 date    2019年04月30日
 */
const badge = require('../util/badge');

let remindDate;
let pTags;
module.exports = {
    // 参数为YYYYMMDD格式的日期
    load: function (date) {
        remindDate = date.replace(/\D*/g, '');
        send('getRemindsByDay', [remindDate, remindDate], function (event, data) {
            let html = '';
            for (let i = 0; i < data.length; i++) {
                const time = window.moment(data[i].remindTime, 'YYYYMMDDHHmmss').format('HH:mm:ss');
                const title = data[i].title;
                html += '<div class="remind-item remind">';
                html += '<p class="remind-id" hidden>' + data[i]._id + '</p>';
                html += '<span class="remind-title"><span>' + time + '</span>&nbsp;<span>' + title + '</span></span>';
                html += badge.priorityBadge(data[i].priority);
                html += badge.intervalBadge(data[i].interval, data[i].dayOfMonth);
                html += '<hr class="layui-bg-gray">';
                html += '</div>';
            }
            $('#remind-list').html(html);

            pTags = $('.remind-item').find('.remind-id');
            for (let i = 0; i < pTags.length; i++) {
                const id = $(pTags[i]).text();
                send('getRemindListDelay', {id: id, remindDate: remindDate}, function (event, data) {
                    if (data) {
                        const span = $(pTags[i]).next();
                        $(span).addClass('delayed');
                        const time = $(span).children().get(0).innerText;
                        $(span).children().get(0).innerText = window.moment(time, 'HH:mm:ss')
                            .add("minutes", data).format('HH:mm:ss');
                    }
                });
            }
        });
    }
};