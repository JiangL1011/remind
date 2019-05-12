// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu, Tray} = require('electron');
const env = require('../config/environment');
const remindTray = require('./remindTray');

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
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // 获取窗口关闭事件
    mainWindow.on('close', function (e) {
        if (!app.isQuiting) {
            e.preventDefault();
            mainWindow.hide();
            tray.displayBalloon({
                title: '贼鸡儿好用的软件',
                content: '程序已最小化到系统托盘！',
                icon: env + 'static/img/lufi.jpg'
            });
            return false;
        }
    });

    // 设置系统托盘
    tray = new Tray(env + "static/img/lufi.ico");
    const contextMenu = Menu.buildFromTemplate([
        {label: '打开窗口', type: 'normal', click: () => mainWindow.show()},
        {
            label: '退出程序', type: 'normal', click: () => {
                app.isQuiting = true;
                app.quit();
            }
        }
    ]);
    tray.setToolTip('贼鸡儿好用的软件');
    tray.setContextMenu(contextMenu);
    tray.on('double-click', function () {
        mainWindow.show();
    });

    remindTray.load(tray, env);
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) createWindow()
});


