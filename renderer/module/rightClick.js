/**
 author:  JiangL
 date:    2019年05月07日
 */

$(function () {
    setTimeout(function () {
        $.contextMenu({
            selector: ".remind",
            items: {
                "delay": {
                    name: "推迟", icon: "edit", callback: function (key, opt) {
                        const that = this;
                        const id = $(that).find('p.remind-id').text();
                        layer.prompt({
                            title: '推迟时间（分钟）',
                            formType: 3,
                            value: '10',
                            maxlength: 3
                        }, function (value, index, elem) {
                            const reg = /^\d{1,3}$/;
                            if (reg.test(value)) {
                                send('delay', {id: id, delay: value}, function (event, data) {
                                    if (data) {
                                        location.reload();
                                    } else {
                                        layer.msg('只能推迟今天的任务');
                                    }
                                })
                            } else {
                                alert('只能输入数字');
                            }
                        });
                    }
                },
                "delete": {
                    name: "删除", icon: "delete", callback: function (key, opt) {
                        const id = $(this).find('p.remind-id').text();
                        send('delRemind', id, function (event, data) {
                            if (data) {
                                location.reload();
                            } else {
                                alert('数据异常');
                            }
                        });
                    }
                }
            }
        });
    });
});