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
                '2019-4-18': '测试日期'
            },
            change: function (value, date) {

            },
            done: function (value, date) {
                if (date.year === 2019 && date.month === 4 && date.date === 18) { //点击2017年8月15日，弹出提示语
                    ins1.hint(value);
                }
            }
        });
    });
});