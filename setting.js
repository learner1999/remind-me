const { desktopCapturer, screen, shell } = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')
const remote = require('electron').remote
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')

// 截图显示
let imgScreenshot = document.getElementById('id-img-screenshot')

// 全屏显示截图按钮
let btnFullScreen = document.getElementById('id-btn-full-screen')

// 确定按钮
let btnComfirm = document.getElementById('id-btn-comfirm')

// 取消按钮
let btnCancel = document.getElementById('id-btn-cancel')

// 屏幕截图保存地址
let screenshotPath = ""

// 当前窗口
let curWin = remote.getCurrentWindow()

// 显示截图通知
let notificationScreenshot = new Notification('remind-me', {
    body: '正在截屏……'
})

// 截取屏幕
screenshot()

// 截取屏幕
function screenshot() {
    const thumbSize = determineScreenShotSize()
    let options = { types: ['screen'], thumbnailSize: thumbSize }

    desktopCapturer.getSources(options, (error, sources) => {
        if (error) return console.log(error)

        // 避免截图的时候将当前窗口给截进去，在截图完成之后再显示
        curWin.show()
        notificationScreenshot.close()

        sources.forEach((source) => {
            if (source.name === 'Entire screen' || source.name === 'Screen 1') {
                screenshotPath = path.join(os.tmpdir(), 'screenshot.png')

                fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
                    if (error) return console.log(error)
                    imgScreenshot.src = screenshotPath
                })
            }
        })
    })
}

// 获取屏幕尺寸
function determineScreenShotSize() {
    const screenSize = screen.getPrimaryDisplay().workAreaSize
    const maxDimension = Math.max(screenSize.width, screenSize.height)
    return {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio
    }
}

btnFullScreen.addEventListener('click', function (event) {
    if (screenshotPath === "") {
        return
    }
    shell.openExternal(`file://${screenshotPath}`)
})

btnComfirm.addEventListener('click', function (event) {

    // 放在外面定义成常量，在多个渲染进程进行访问的时候有点问题，挪到里面定义成变量使用
    let adapter = new FileSync('db.json')
    let db = low(adapter)

    // 几分钟后提醒
    let minute = document.getElementById('id-input-time').value
    let curTime = new Date().getTime()
    let remindTime = curTime + minute * 60 * 1000

    // 初始化数据库
    db.defaults({ records: [] })
        .write()

    // 向数据库添加一条记录
    db.get('records')
        .push({
            // 主键 ID
            id: shortid.generate(),
            // 描述
            desc: document.getElementById('id-input-desc').value,
            // 提醒的时间
            time: remindTime,
        })
        .write()

    curWin.close()
})

btnCancel.addEventListener('click', function (event) {
    curWin.close()
})