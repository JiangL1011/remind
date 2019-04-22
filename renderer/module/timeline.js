/**
 author:  JiangL
 date:    2019年04月21日
 */

$(function () {
    const container = $('#timeline-container');
    container.height(document.documentElement.clientHeight);

    window.onresize = function () {
        const height = document.documentElement.clientHeight;
        container.height(height);
    };

});

// 输入参数均为YYYYMMDD格式的日期
module.exports = {
    load: function (start, end) {
        send('loadTimeline', [start, end], function (even, data) {
            console.log(data);
        });
    }
};