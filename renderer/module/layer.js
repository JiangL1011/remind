/**
 author:  JiangL
 date:    2019年04月21日
 */
$(function () {
    const newRemindForm = $('#new-remind-form');

    layui.use('layer', function () {
        const layer = layui.layer;

        $('#new-remind-btn').click(function () {
            layer.open({
                type: 1,
                title: '新增提醒',
                content: newRemindForm,
                anim: 1,
                area: ['500px', '600px'],
                cancel: function (index, layero) {
                    newRemindForm.hide();
                    layer.close(index);
                    return false;
                }
            });
        });

    });
});