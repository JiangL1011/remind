/**
 author:  JiangL
 date:    2019年05月04日
 */

const Nedb = require('nedb');
const moment = require('moment');

const db = new Nedb({
    filename: 'data/detail.db',
    autoload: true
});

module.exports = {
    // 检查该任务是否提醒过
    reminded: function (id, remindDate, callBack) {
        db.find({_id: id, remindDate: remindDate}, function (err, docs) {
            if (!docs || docs.length === 0) {
                db.insert({id: id, remindDate: remindDate, reminded: false});
                callBack(false);
            } else {
                const doc = docs[0];
                if (doc.reminded) {
                    callBack(true);
                } else {
                    // db.update();
                    callBack(false);
                }
            }
        });
    },
    hasReminded: function () {

    }
};