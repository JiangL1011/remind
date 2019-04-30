/**
 author:  JiangL
 date:    2019年04月17日
 */
const timeline = require('./timeline');
const remindList = require('./remindList');

$(function () {

    layui.use('laydate', function () {
        // 主日历
        layui.laydate.render({
            elem: '#calendar',
            position: 'static',
            btns: ['now'],
            theme: '#1E9FFF',
            format: 'yyyy年MM月dd日',
            calendar: true,
            done: function (value, date) {
                remindList.load(value);
            }
        });

        // 页面加载就载入当天的remindList
        remindList.load(window.moment().format('YYYYMMDD'));

        // 单次提醒日历
        layui.laydate.render({
            elem: '#deadline',
            btns: ['now', 'confirm'],
            theme: '#1E9FFF',
            format: 'yyyy-MM-dd HH:mm:ss',
            type: 'datetime',
            calendar: true,
            change: function (value, date) {

            }
        });

        // 重复提醒
        layui.laydate.render({
            elem: '#repeatTime',
            btns: ['now', 'confirm'],
            theme: '#1E9FFF',
            format: 'HH:mm:ss',
            type: 'time',
            change: function (value, date) {

            }
        });

        // 时间线内容展示范围，默认展示未来十天之内的任务
        layui.laydate.render({
            elem: '#timeline-range',
            range: '至',
            theme: '#1E9FFF',
            format: 'yyyy年MM月dd日',
            value: window.moment().format('YYYY年MM月DD日') + ' 至 ' +
                window.moment().add(9, 'days').format('YYYY年MM月DD日'),
            done: function (value, start, end) {
                timelineLoad(value);
            }
        });

        // 页面加载完就展示时间线
        timelineLoad($('#timeline-range').val());

    });

});

const timelineLoad = function (date) {
    date = date.replace(/\D*/g, '');
    timeline.load(date.substr(0, date.length / 2), date.substr(date.length / 2, date.length - 1));
};