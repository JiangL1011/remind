/**
 author:  JiangL
 date:    2019年04月18日
 */

const channelArr = {};

const send = function (channel, data, callBack) {
    electron.ipcRenderer.send(channel, data);

    if (channelArr[channel] === undefined) {
        channelArr[channel] = electron.ipcRenderer.on(channel, function (event, data) {
            if (callBack !== undefined) {
                callBack(event, data);
            }
        });
    }

};

const receive = function (channel, callBack) {
    if (channelArr[channel] === undefined) {
        channelArr[channel] = electron.ipcRenderer.on(channel, function (event, data) {
            if (callBack !== undefined) {
                callBack(event, data);
            }
        })
    }
};