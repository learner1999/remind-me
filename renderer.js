const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

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
                // 提醒用户
                new Notification('remind-me', {
                    body: record.desc
                })

                // 删除记录
                db.get('records').remove({ id: record.id }).write()
            }
        });
    }, 1000)
}