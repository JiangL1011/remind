/**
 author:  JiangL
 date:    2019年04月17日
 */
$(function () {
    laydate.render({
        elem: '#test2',
        position: 'static',
        change: function (value, date) { //监听日期被切换
            lay('#testView').html(value);
        }
    });
});
