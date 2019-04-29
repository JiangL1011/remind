/**
 author:  JiangL
 date:    2019年04月21日
 */

$(function () {
    const container = $('#timeline-container');
    container.height(document.documentElement.clientHeight - 145);

    window.onresize = function () {
        const height = document.documentElement.clientHeight - 145;
        container.height(height);
    };

});

// 输入参数均为YYYYMMDD格式的日期
module.exports = {
    load: function (start, end) {
        send('loadTimeline', [start, end], function (even, data) {
            console.log(data);

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
                    html += '<div class="layui-card remind-card">\n';
                    html += '  <div class="layui-card-header">';
                    html += '    <h3 class="remind-title">' + time + '&nbsp;' + remind.title + '</h3>';

                    html += priorityBadge(remind.priority);
                    html += intervalBadge(remind.interval, remind.dayOfMonth);

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

const priorityBadge = function (priority) {
    const colors = [
        'layui-bg-green',
        'layui-bg-blue',
        'layui-bg-cyan',
        'layui-bg-orange',
        // 未定义颜色则默认红色
        ''
    ];
    return '<span class="layui-badge ' + colors[priority - 1] + '">' + priority + '</span>';
};

const intervalBadge = function (interval, day) {
    let text;
    if (!interval) {
        text = '当日';
    } else if (interval === 'everyDay') {
        text = '每日';
    } else if (interval === 'everyWeek') {
        text = '每周';
        /*const week = ['日', '一', '二', '三', '四', '五', '六'];
        if (typeof day === 'number') {
            text = '每周' + week[day];
        } else {
            text = '每周';
            for (let i = 0; i < day.length; i++) {
                text += week[day[i]];
                if (i + 1 !== day.length) {
                    text += '、';
                }
            }
        }*/
    } else {
        text = '每月' + day + '号';
    }
    return '<span class="layui-badge layui-bg-gray">' + text + '</span>';
};