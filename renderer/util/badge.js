/**
 author  蒋领
 date    2019年04月30日
 */

module.exports = {
    priorityBadge: function (priority) {
        const colors = [
            'layui-bg-green',
            'layui-bg-blue',
            'layui-bg-cyan',
            'layui-bg-orange',
            // 未定义颜色则默认红色
            ''
        ];
        const title = [
            '很低',
            '略低',
            '一般',
            '很高',
            '贼高'
        ];
        return '<span class="layui-badge ' + colors[priority - 1] + '">' + title[priority - 1] + '</span>';
    },
    intervalBadge: function (interval, day) {
        let text;
        if (!interval) {
            text = '当日';
        } else if (interval === 'everyDay') {
            text = '每日';
        } else if (interval === 'everyWeek') {
            text = '每周';
        } else {
            text = '每月' + day + '号';
        }
        return '<span class="layui-badge layui-bg-gray">' + text + '</span>';
    }
};