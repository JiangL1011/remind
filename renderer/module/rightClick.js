/**
 author:  JiangL
 date:    2019年05月07日
 */
const remindDB = require('../dao/remind');

$(function () {
    setTimeout(function () {
        $.contextMenu({
            selector: ".remind",
            items: {
                "complete": {
                    name: "完成", icon: "add", callback: function (key, opt) {
                        const that = this;
                        const id = $(that).find('p.remind-id').text();
                        const selectedDay = $(that).parent().find('.layui-timeline-title').text().replace(/\D*/g, '');
                        const today = window.moment().format('YYYYMMDD');
                        if (selectedDay !== today) {
                            layer.alert('只能完成今天的任务');
                            return;
                        }

                        remindDB.getById(id, function (data) {
                            const todayDetail = data.detail[today];
                            if (todayDetail && todayDetail.finished) {
                                layer.alert('不能完成已经完成的任务');
                            } else {
                                const where = {_id: id};
                                const set = {['detail.' + today + '.finished']: window.moment().format('HHmmss')};
                                const type = 'set';
                                remindDB.update(where, set, type, function (backData) {
                                    if (backData) {
                                        alert(123);
                                    }
                                });
                            }
                        });


                    }
                },
                "sep1": "---------",
                "delay": {
                    name: "推迟", icon: "edit", callback: function (key, opt) {
                        const that = this;
                        const id = $(that).find('p.remind-id').text();
                        const selectedDay = $(that).parent().find('.layui-timeline-title').text().replace(/\D*/g, '');
                        const today = window.moment().format('YYYYMMDD');
                        if (selectedDay !== today) {
                            layer.alert('只能推迟今天的任务');
                            return;
                        }
                        layer.prompt({
                            title: '推迟时间（分钟）',
                            formType: 0,
                            value: '10',
                            maxlength: 3
                        }, function (value, index, elem) {
                            const reg = /^\d{1,3}$/;
                            if (reg.test(value)) {
                                remindDB.getById(id, function (doc) {
                                    console.log(doc);
                                    const where = {_id: id};
                                    const key = 'detail.' + today + '.delay';
                                    const set = {[key]: value};
                                    remindDB.update(where, set, 'set', function (data) {
                                        if (data) {
                                            location.reload();
                                        }
                                    });
                                });
                            } else {
                                alert('只能输入数字');
                            }
                        });
                    }
                },
                "delete": {
                    name: "删除", icon: "delete", callback: function (key, opt) {
                        const id = $(this).find('p.remind-id').text();
                        remindDB.deleteById(id, function (data) {
                            if (data) {
                                location.reload();
                            }
                        })
                    }
                }
            }
        });
    });
});