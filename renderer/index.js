/**
 author:  JiangL
 date:    2019年04月17日
 */
$(function () {
    layui.use('laydate', function () {
        const ins1 = layui.laydate.render({
            elem: '#calendar',
            position: 'static',
            mark: {
                '2019-4-18': ''
            },
            change: function (value, date) {

            },
            done: function (value, date) {

            }
        });
    });

});