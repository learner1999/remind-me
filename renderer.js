// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {desktopCapturer, screen, shell} = require('electron')
const fs = require('fs')
const os = require('os')
const path = require('path')

const btnScreenshot = document.getElementById('screenshot')

btnScreenshot.addEventListener('click', (event) => {
    screenshot();
})

// 截取屏幕
function screenshot() {
    const thumbSize = determineScreenShotSize()
    let options = { types: ['screen'], thumbnailSize: thumbSize }

    desktopCapturer.getSources(options, (error, sources) => {
        if (error) return console.log(error)

        sources.forEach((source) => {
            if (source.name === 'Entire screen' || source.name === 'Screen 1') {
                const screenshotPath = path.join(os.tmpdir(), 'screenshot.png')

                fs.writeFile(screenshotPath, source.thumbnail.toPNG(), (error) => {
                if (error) return console.log(error)
                shell.openExternal(`file://${screenshotPath}`)
                })
            }
        })
    })
}

function determineScreenShotSize () {
const screenSize = screen.getPrimaryDisplay().workAreaSize
const maxDimension = Math.max(screenSize.width, screenSize.height)
    return {
        width: maxDimension * window.devicePixelRatio,
        height: maxDimension * window.devicePixelRatio
    }
}
  