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
                    if (remind.detail[key] && remind.detail[key].delay && remind.detail[key].delay !== '0') {
                        time = window.moment(time, 'HH:mm:ss').add('minutes', remind.detail[key].delay).format('HH:mm:ss');
                        html += '<h3 class="remind-title delayed"><span>' + time
                            + '</span>&nbsp;<span>' + remind.title + '</span></h3>';
                    } else {
                        html += '<h3 class="remind-title"><span>' + time + '</span>&nbsp;<span>' + remind.title +
                            '</span></h3>';
                    }

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
        });
    }
};