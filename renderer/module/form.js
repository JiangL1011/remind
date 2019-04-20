/**
 author:  JiangL
 date:    2019年04月21日
 */

$(function () {
    // 设置提醒方式时对应的表单内容
    const deadline = $('#deadlineForm');
    const repeat = $('#repeatTimeForm');
    const daySelector = $('#daySelector');
    for (let i = 1; i <= 31; i++) {
        $(daySelector).append($('<option value="' + i + '" ' + (i === 1 ? 'selected' : '') + '>' + i + '</option>'));
    }
    const week = $('#week');
    const month = $('#month');

    layui.use('form', function () {

        //新增提醒表单
        const form = layui.form;
        form.render();
        form.on('submit(newRemind)', function (data) {
            const form = data.field;
            // 单次提醒的时间不得早于当前时间
            if (form.type === 'once') {
                const nowDate = new Date();
                // 获取当前时间和提交时间，并转成格式为yyyyMMddHHmmss的整数，然后比较大小
                const nowNumber = parseInt(nowDate.getFullYear() + '' +
                    ((nowDate.getMonth() + 1) > 9 ? (nowDate.getMonth() + 1) : ('0' + (nowDate.getMonth() + 1))) + '' +
                    nowDate.getDate() + '' + nowDate.getHours() + '' + nowDate.getMinutes() + '' +
                    nowDate.getSeconds());
                const formDate = parseInt(form.deadline.replace(' ', '').replace(/[-:]/g, ''));
                if (formDate <= nowNumber) {
                    layer.alert('截至时间不能早于当前时间！');
                    return false;
                }
            }
            console.log(form);
            return false;
        });

        // repeat类型的表单dom必须要在对应的时间控件监听加载完成后
        // 才能被移除，否则显示不出时间控件
        repeat.remove();
        form.on('radio(type)', function (data) {
            const type = data.value;

            if (type === 'once') {
                repeat.after(deadline);
                repeat.remove();
            } else {
                deadline.after(repeat);
                deadline.remove();
            }
        });

        // 监听提醒频率
        week.remove();
        month.remove();
        form.on('radio(interval)', function (data) {
            const type = data.value;

            if (type === 'everyDay') {
                week.remove();
                month.remove();
            } else if (type === 'everyWeek') {
                repeat.append(week);
                month.remove();
            } else {
                repeat.append(month);
                week.remove();
            }
        });
    });

});