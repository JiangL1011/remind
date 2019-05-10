/**
 author:  JiangL
 date:    2019年04月21日
 */
const badge = require('../util/badge');
const remindDB = require('../dao/remind');

let pTags;
// 输入参数均为YYYYMMDD格式的日期
module.exports = {
    load: function (start, end) {
        remindDB.getByRangeDate(start, end, function (data) {
            let html = '<ul class="layui-timeline">\n';

            for (let key in data) {
                const reminds = data[key];
                const date = window.moment(key, 'YYYYMMDD').format('YYYY年MM月DD日 dddd');
                html += '      <li class="layui-timeline-item">\n';
                html += '          <i class="layui-icon layui-timeline-axis">&#xe63f;</i>\n';
                html += '          <div class="layui-timeline-content layui-text">\n';
                html += '             <h3 class="layui-timeline-title">' + date + '</h3>\n';

                for (const remind of reminds) {
                    let time;
                    if (remind.repeatTime) {
                        time = window.moment(remind.repeatTime, 'HHmmss').format('HH:mm:ss');
                    } else {
                        // 单次提醒没有repeatTime属性
                        time = window.moment(remind.remindTime.toString().substr(8, 13), 'HHmmss').format('HH:mm:ss');
                    }
                    html += '<div class="layui-card remind-card remind">\n';
                    html += '<p class="remind-id" hidden>' + remind._id + '</p>';
                    html += '  <div class="layui-card-header">';
                    html += '    <h3 class="remind-title"><span>' + time + '</span>&nbsp;<span>' + remind.title +
                        '</span></h3>';

                    html += badge.priorityBadge(remind.priority);
                    html += badge.intervalBadge(remind.interval, remind.dayOfMonth);

                    html += '  </div>\n';
                    html += '  <div class="layui-card-body">\n';
                    html += '    ' + remind.content + '\n';
                    html += '  </div>\n';
                    html += '</div>';
                }

                html += '           </div>\n';
                html += '      </li>\n';
            }

            html += '      <li class="layui-timeline-item">\n';
            html += '      <i class="layui-icon layui-timeline-axis">&#xe63f;</i>\n';
            html += '      </li>\n';
            html += '   </ul>';

            $('#timeline-container').html(html);

            pTags = $('.remind-card').find('.remind-id');
            for (let i = 0; i < pTags.length; i++) {
                const id = $(pTags[i]).text();
                const remindDate = $(pTags[i]).parent().prev().text().replace(/\D*/g, '');
                send('getTimelineDelay', {id: id, remindDate: remindDate, index: i}, function (event, data) {
                    if (data) {
                        const h3 = $(pTags[data.index]).next().children().get(0);
                        $(h3).addClass('delayed');
                        const time = $(h3).children().get(0).innerText;
                        $(h3).children().get(0).innerText = window.moment(time, 'HH:mm:ss')
                            .add("minutes", data.delay).format('HH:mm:ss');
                    }
                });
            }
        });
    }
};