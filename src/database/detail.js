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
        db.find({id: id, remindDate: remindDate}, function (err, docs) {
            if (!docs || docs.length === 0) {
                db.insert({id: id, remindDate: remindDate, reminded: false});
                callBack(false);
            } else {
                const doc = docs[0];
                callBack(doc.reminded);
            }
        });
    },
    remind: function (id, remindDate) {
        db.update({
            id: id,
            remindDate: remindDate
        }, {
            $set: {
                reminded: true
            }
        });
    },
    delete: function (id, callback) {
        db.remove({id: id}, {}, function (err, numDeleted) {
            callback(err, numDeleted);
        });
    },
    // 推迟单位：分钟，并且只能推迟当天的任务
    delay: function (id, delay, callback) {
        const today = moment().format('YYYYMMDD');
        db.update({id: id, remindDate: today}, {
            $set: {
                reminded: false,
                delay: delay
            }
        }, {}, function (err, numReplaced) {
            if (!err && numReplaced === 1) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },
    getDelayStatus: function (id, remindDate, callback) {
        db.find({id: id, remindDate: remindDate}, function (err, docs) {
            callback(docs[0].delay);
        });
    }
};