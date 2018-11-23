const { desktopCapturer, screen, shell } = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')
const remote = require('electron').remote
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')
const ipcRenderer = require('electron').ipcRenderer

// 截图显示
let imgScreenshot = document.getElementById('id-img-screenshot')

// 全屏显示截图按钮
let btnFullScreen = document.getElementById('id-btn-full-screen')

// 确定按钮
let btnComfirm = document.getElementById('id-btn-comfirm')

// 取消按钮
let btnCancel = document.getElementById('id-btn-cancel')

// 描述文本框
let inputDesc = document.getElementById('id-input-desc')

// 描述区域 div
let divDesc = document.getElementById('id-div-desc')

// 屏幕截图保存地址
let screenshotPath = ""

// 当前窗口
let curWin = remote.getCurrentWindow()

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
            // 截图文件路径
            screenshotPath: screenshotPath,
            // 描述
            desc: inputDesc.value,
            // 提醒的时间
            time: remindTime,
        })
        .write()

    curWin.close()
})

btnCancel.addEventListener('click', function (event) {
    curWin.close()
})

ipcRenderer.on('input-received', function (event, data) {
    console.log(data)

    // 显示对应的截图
    screenshotPath = data.record.screenshotPath
    imgScreenshot.src = screenshotPath

    // 显示对应描述
    inputDesc.value = data.record.desc
    divDesc.classList.add('mdui-textfield-not-empty')
})