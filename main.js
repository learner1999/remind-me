// Modules to control application life and create native browser window
const {app, BrowserWindow, globalShortcut} = require('electron')
const path = require('path')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  registerHotkey()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// 注册快捷键
function registerHotkey() {
  const ret = globalShortcut.register('CommandOrControl+Alt+X', () => {
    console.log('CommandOrControl+Alt+X is pressed')

    // 打开设置提醒时间窗口
    const modalPath = path.join('file://', __dirname, 'setting.html')
    let win = new BrowserWindow({ width: 400, height: 320 })

    win.on('close', () => { win = null })
    win.loadURL(modalPath)
    win.show()
  })

  if (!ret) {
    console.log('registration failed')
  }

  // 检查快捷键是否注册成功
  console.log("registration" + globalShortcut.isRegistered('CommandOrControl+Alt+X'))
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('will-quit', () => {
  console.log("unregister hotkey")

  // 注销快捷键
  globalShortcut.unregister('CommandOrControl+X')

  // 清空所有快捷键
  globalShortcut.unregisterAll()
})