/**
 author:  JiangL
 date:    2019年04月21日
 */
const Nedb = require('nedb');
const communicate = require('../util/communicate');

const db = new Nedb({
    filename: 'data/remind.db',
    autoload: true
});

communicate.receive('submit-new-remind', function (event, data) {
    db.insert(data, function (err, newDoc) {
        event.sender.send('submit-new-remind', !err);
    });
});

