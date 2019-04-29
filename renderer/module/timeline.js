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
                    const time = window.moment(remind.repeatTime, 'hhmmss').format('hh:mm:ss');
                    html += '<div class="layui-card remind-card">\n';
                    html += '  <div class="layui-card-header"><h3>' + time + '&nbsp;' + remind.title + '</h3></div>\n';
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