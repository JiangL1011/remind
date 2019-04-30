/**
 author  蒋领
 date    2019年04月30日
 */

module.exports = {
    load: function (tray, env) {
        tray.displayBalloon({
            title: '贼鸡儿好用的软件',
            content: '123123！',
            icon: env + 'static/img/lufi.jpg'
        });
    }
};