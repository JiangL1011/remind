/**
 author:  JiangL
 date:    2019年04月17日
 */
$(function () {
    layui.use(['laydate', 'slider'], function () {
        const ins1 = layui.laydate.render({
            elem: '#calendar',
            position: 'static',
            btns: ['now'],
            theme: '#1E9FFF',
            format: 'yyyy年MM月dd日',
            /*mark: {
                '2019-4-18': ''
            },*/
            change: function (value, date) {
                $('#form-deadline').val(value);
            },
            done: function (value, date) {

            }
        });

        layui.slider.render({
            elem: '#slide-priority',
            theme: '#1E9FFF',
            input: true,
            step: 1,
            min: 1,
            max: 10
        });
    });

});