/**
 author:  JiangL
 date:    2019年04月17日
 */

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
            /*mark: {
                '2019-4-18': ''
            },*/
            change: function (value, date) {

            },
            done: function (value, date) {

            }
        });

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

    });

});