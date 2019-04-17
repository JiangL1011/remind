// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, Tray} = require('electron');
const electron = require('electron');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

let tray;

function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    // and load the index.html of the app.
    mainWindow.loadFile('page/index.html');

    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null
    });

    // 设置系统托盘
    tray = new Tray("static/img/lufi.ico");
    const contextMenu = Menu.buildFromTemplate([
        {label: '退出程序', type: 'normal', click: () => app.quit()}
    ]);
    tray.setToolTip('贼鸡儿好用的软件');
    tray.setContextMenu(contextMenu);
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    /*if (process.platform !== 'darwin') {
        app.quit();
    }*/
    tray.displayBalloon({
        title: '贼鸡儿好用的软件',
        content: '程序已最小化到系统托盘！',
        icon: 'static/img/lufi.jpg'
    });
});

app.on('activate', function () {
    if (mainWindow === null) createWindow()
});

electron.ipcMain.on('readJson', function (event, args) {
    fs.readFile(args, 'utf8', function (err, data) {
        event.sender.send('readJson', data);
    })
});
