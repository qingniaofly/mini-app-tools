// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//   const replaceText = (selector, text) => {
//     const element = document.getElementById(selector)
//     if (element) element.innerText = text
//   }

//   for (const type of ['chrome', 'node', 'electron']) {
//     replaceText(`${type}-version`, process.versions[type])
//   }
// })

window.electron = window.require('electron')

const { ipcRenderer } = electron
const Logger = require('./lib/logger')

const trace = console.trace
const log = console.log
const info = console.info
const warn = console.warn
const error = console.error
const logger = {
    sendLogMessage: function (level, data) {
        ipcRenderer.send('Log', { category: 'mini-tools-web', level, data })
    },
    trace: function (...args) {
        trace.apply(console, args)
        logger.sendLogMessage('trace', args)
    },
    debug: function (...args) {
        log.apply(console, args)
        logger.sendLogMessage('debug', args)
    },
    log: function (...args) {
        log.apply(console, args)
        logger.sendLogMessage('log', args)
    },
    info: function (...args) {
        info.apply(console, args)
        logger.sendLogMessage('trace', args)
    },
    warn: function (...args) {
        warn.apply(console, args)
        logger.sendLogMessage('warn', args)
    },
    error: function (...args) {
        error.apply(console, args)
        logger.sendLogMessage('error', args)
    },
    fatal: function (...args) {
        error.apply(console, args)
        logger.sendLogMessage('fetal', args)
    },
}
/**
 * 全局监控 JS 异常
 * @param {String} errorMessage  错误信息
 * @param {String} scriptURI   出错的文件
 * @param {Long}  lineNumber   出错代码的行号
 * @param {Long}  columnNumber  出错代码的列号
 * @param {Object} errorObj    错误的详细信息
 * https://www.jianshu.com/p/5e54108aa352
 */
window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
    console.error('window.onerror:', errorMessage, scriptURI, lineNumber, columnNumber, errorObj)
}
// 全局监控静态资源异常
window.addEventListener('error', (...args) => {
    console.error('window.addEventListener:error:', args)
})
// 捕获没有 Catch 的 Promise 异常
window.addEventListener('unhandledrejection', (...args) => {
    console.error('window.addEventListener:unhandledrejection:', args)
})
// 对网页崩溃的监控
window.addEventListener('load', () => {
    sessionStorage.setItem('good_exit', 'pending')
    setInterval(() => {
        sessionStorage.setItem('time_before_crash', new Date().toString())
    }, 1000)
})
window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('good_exit', 'true')
})
if (sessionStorage.getItem('good_exit') && sessionStorage.getItem('good_exit') !== 'true') {
    console.error('page has crash:', sessionStorage.getItem('time_before_crash'))
}
if ('serviceWorker' in navigator) {
    // 注册，这将告诉浏览器 Service Worker JavaScript 文件的位置
    window.addEventListener('load', function () {
        //register 精妙之处在于文件的位置，如果是/eg/sw.js,则意味着服务工作线程的作用域是网址/eg/开头的页面
        navigator.serviceWorker.register('./sw.js').then(
            (registration) => {
                console.log('ServiceWorker registration successful with scope:', registration.scope)
            },
            (err) => {
                console.log('ServiceWorker registration failed: ', err)
            }
        )
    })
}
new Logger(logger).init()
