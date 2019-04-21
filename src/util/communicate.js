/**
 author:  JiangL
 date:    2019年04月18日
 */
const electron = require('electron');

const channelArr = {};
const receive = function (channel, listener) {
    if (channelArr[channel] === undefined) {
        electron.ipcMain.on(channel, function (event, args) {
            const result = listener(event, args);
            if (result !== undefined) {
                event.sender.send(channel, result);
            }
        });
    }
};

const send = function (channel, data) {
    electron.ipcRenderer.send(channel, data);
};

module.exports = {
    receive: receive,
    send: send
};