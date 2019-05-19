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
                        const idAndDate = $(that).find('p.remind-id').text().split(':');
                        const id = idAndDate[0];
                        const selectedDay = idAndDate[1];
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
                                        layer.alert('任务已完成', function () {
                                            location.reload();
                                        });
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
                        const idAndDate = $(that).find('p.remind-id').text().split(':');
                        const id = idAndDate[0];
                        const selectedDay = idAndDate[1];
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
                                    const where = {_id: id};
                                    const key = 'detail.' + today;
                                    const set = {[key + '.delay']: value, [key + '.reminded']: false};
                                    remindDB.update(where, set, 'set', function (data) {
                                        if (data) {
                                            layer.alert('推迟成功', function () {
                                                location.reload();
                                            });
                                        }
                                    });
                                });
                            } else {
                                layer.alert('只能输入数字');
                            }
                        });
                    }
                },
                "delete": {
                    name: "删除", icon: "delete", callback: function (key, opt) {
                        const that = this;
                        const idAndDate = $(that).find('p.remind-id').text().split(':');
                        const id = idAndDate[0];
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