/**
 author:  JiangL
 date:    2019年04月21日
 */

$(function () {
    const container = $('#timeline-container');
    container.height(document.documentElement.clientHeight - 135);

    window.onresize = function () {
        const height = document.documentElement.clientHeight - 135;
        container.height(height);
    };

});

// 输入参数均为YYYYMMDD格式的日期
module.exports = {
    load: function (start, end) {
        send('loadTimeline', [start, end], function (even, data) {
            console.log(data);
            let html = '<ul class="layui-timeline">\n';
            for (let i = 0; i < data.length; i++) {
                let record = data[i];
                const remindDate = record.remindDate;
                html += '                    <li class="layui-timeline-item">\n';
                html += '                        <i class="layui-icon layui-timeline-axis">&#xe63f;</i>\n';
                html += '                        <div class="layui-timeline-content layui-text">\n';
                html += '                            <h2 class="layui-timeline-title">' +
                    window.moment(remindDate, 'YYYYMMDD').format('YYYY年MM月DD日') + '</h2>\n';
                html += '                            <div class="layui-collapse">\n';
                while (true) {
                    const time = record.repeatTime ? record.repeatTime : (record.deadline.split(' ')[1]);
                    html += '                                <div class="layui-colla-item">\n';
                    html += '                                    <h3 class="layui-colla-title">' + record.title + '\t' +
                        time + '</h3>\n';
                    html += '                                    <div class="layui-colla-content' +
                        ' layui-show">' + record.content + '</div>\n';
                    html += '                                </div>\n';
                    i++;
                    if (i >= data.length) {
                        i--;
                        break;
                    }
                    if (data[i].remindDate !== remindDate) {
                        i--;
                        break;
                    } else {
                        record = data[i];
                    }
                }
                html += '                            </div>\n';
                html += '                        </div>\n';
                html += '                    </li>\n';
            }
            html += '                </ul>';

            $('#timeline-container').html(html);

        });
    }
};