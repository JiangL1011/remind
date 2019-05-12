/**
 author:  JiangL
 date:    2019年04月21日
 */
const remindDB = require('../dao/remind');

$(function () {
    const remind = function () {
        let title, type, deadline, priority, content, interval, repeatTime, dayOfWeek, dayOfMonth, detail;
        const createTime = window.moment().format('YYYYMMDDHHmmss');
        return {
            setTitle(title_) {
                title = title_;
            },
            setType(type_) {
                type = type_;
            },
            setDeadline(deadline_) {
                deadline = deadline_;
            },
            setPriority(priority_) {
                priority = priority_;
            },
            setContent(content_) {
                content = content_;
            },
            setInterval(interval_) {
                interval = interval_;
            },
            setRepeatTime(repeatTime_) {
                repeatTime = repeatTime_;
            },
            setDayOfWeek(dayOfWeek_) {
                dayOfWeek = dayOfWeek_;
            },
            setDayOfMonth(dayOfMonth_) {
                dayOfMonth = dayOfMonth_
            },
            setDetail(detail_) {
                detail = detail_;
            },
            getRemind() {
                return {
                    title: title,
                    type: type,
                    deadline: deadline,
                    priority: priority,
                    content: content,
                    interval: interval,
                    repeatTime: repeatTime,
                    dayOfWeek: dayOfWeek,
                    dayOfMonth: dayOfMonth,
                    createTime: createTime,
                    detail: detail
                }
            }
        }
    };

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
                // 获取当前时间和提交时间，并转成格式为YYYYMMDDHHmmss的整数，然后比较大小
                const nowDate = window.moment().format('YYYYMMDDHHmmss');
                const formDate = parseInt(form.deadline.replace(' ', '').replace(/[-:]/g, ''));
                if (formDate <= nowDate) {
                    layer.alert('截至时间不能早于当前时间！');
                    return false;
                }
            }
            // 调整form结构
            const arr = [];
            const r = new remind();
            r.setDetail({});
            if (form.deadline) {
                r.setDeadline(window.moment(form.deadline, 'YYYY-MM-DD HH:mm:ss').format('YYYYMMDDHHmmss'));
            } else {
                r.setRepeatTime(window.moment(form.repeatTime, 'HH:mm:ss').format('HHmmss'));
            }
            r.setInterval(form.interval);
            r.setContent(form.content);
            r.setPriority(form.priority);
            r.setTitle(form.title);
            r.setType(form.type);
            r.setDayOfMonth(form.dayOfMonth);
            if (form.interval === 'everyWeek') {
                for (let key in form) {
                    // noinspection JSUnfilteredForInLoop
                    if (/^[we{2}k]/.test(key)) {
                        // noinspection JSUnfilteredForInLoop
                        r.setDayOfWeek(key.substring(5, 6));
                        const r_ = r.getRemind();
                        arr.push({...r_});
                    }
                }
            } else {
                arr.push(r.getRemind());
            }

            remindDB.add(arr, function (result) {
                if (result) {
                    layer.alert('新增提醒成功！', function () {
                        location.reload();
                    });
                } else {
                    layer.alert('新增提醒失败！');
                }
            });
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

        $('#reset').click(function () {
            if ($('#deadlineForm').length === 0) {
                repeat.after(deadline);
                repeat.remove();
            }
        });
    });

});
