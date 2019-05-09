/**
 author:  JiangL
 date:    2019年05月04日
 */

const Nedb = require('nedb');
const moment = require('moment');
const communicate = require('../util/communicate');

const db = new Nedb({
    filename: 'data/detail.db',
    autoload: true
});

// 检查是否是延期过的任务
communicate.receive('getRemindListDelay', function (event, data) {
    db.find({
        $where: function () {
            const id = this.id;
            const remindDate = parseInt(this.remindDate);
            return data.id === id && parseInt(data.remindDate) === remindDate;
        }
    }, function (err, docs) {
        if (docs && docs.length > 0) {
            const delay = docs[0].delay;
            event.sender.send('getRemindListDelay', delay);
        } else {
            event.sender.send('getRemindListDelay', false);
        }
    });
});

communicate.receive('getTimelineDelay', function (event, data) {
    db.find({
        $where: function () {
            const id = this.id;
            const remindDate = parseInt(this.remindDate);
            return data.id === id && parseInt(data.remindDate) === remindDate;
        }
    }, function (err, docs) {
        if (docs && docs[0] && docs[0].delay) {
            const delay = docs[0].delay;
            event.sender.send('getTimelineDelay', {delay: delay, index: data.index});
        } else {
            event.sender.send('getTimelineDelay', false);
        }
    });
});

module.exports = {
    // 检查该任务是否提醒过
    reminded: function (id, remindDate, callBack) {
        db.find({id: id, remindDate: remindDate}, function (err, docs) {
            if (!docs || docs.length === 0) {
                db.insert({id: id, remindDate: remindDate, reminded: false});
                callBack({reminded: false, delay: docs[0].delay});
            } else {
                const doc = docs[0];
                callBack({reminded: doc.reminded, delay: docs[0].delay});
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
    }
};