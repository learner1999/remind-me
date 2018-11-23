const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const { BrowserWindow } = require('electron').remote
const path = require('path')

startCheckRecord()

// 开始检查是否需要提醒
function startCheckRecord() {
    setInterval(function () {

        // 放在外面定义成常量，在多个渲染进程进行访问的时候有点问题，挪到里面定义成变量使用
        let adapter = new FileSync('db.json')
        let db = low(adapter)

        let records = db.get('records').value()
        console.log(records)
        records.forEach(record => {
            console.log('record.time#' + record.time + ', new Date().getTime()#' + new Date().getTime())
            if (record.time < new Date().getTime()) {
                // 弹个界面出来提醒用户
                const modalPath = path.join('file://', __dirname, 'remind.html')
                let win = new BrowserWindow({ width: 400, height: 520 })
                win.on('close', () => { win = null })
                win.loadURL(modalPath)

                // 删除记录
                db.get('records').remove({ id: record.id }).write()
            }
        });
    }, 1000)
}