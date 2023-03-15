const log4js = require('log4js')
const { ipcMainEvent } = require('./event')

const log4configure = (log4js, config) => {
    const { filePath = './logs', mainName = 'main', renderName = 'render' } = config || {}
    log4js.configure({
        appenders: {
            console: { type: 'console' }, // 输出到控制台

            fileLog: {
                type: 'file', //写在一个文件里面
                filename: `${filePath}/log.log`,
                keepFileExt: true,
                maxLogSize: 1024 * 1024 * 100, // 文件最大容纳值
                backups: 3,
            },
            //错误日志 type:过滤类型logLevelFilter,将过滤error日志写进指定文件
            errorLog: {
                type: 'dateFile', //设置每天：以日期为单位,数据文件类型，dataFiel 注意设置pattern，alwaysIncludePattern属性
                filename: `${filePath}/error.log`, // 输出到文件的文件路径，注意最后/是文件名前缀，如果只写./logs则只会在应用程序根目录生成文件
                alwaysIncludePattern: true, //始终包含pattern
                keepFileExt: true, // 日志文件是否始终保持后缀
                pattern: 'yyyy-MM-dd', // 每天生成按这个格式拼接到filename后边
            },
            error: { type: 'logLevelFilter', level: 'error', appender: 'errorLog' },

            renderFileLog: {
                type: 'file', //写在一个文件里面
                filename: `${filePath}/${renderName}.log`,
                keepFileExt: true,
                maxLogSize: 1024 * 1024 * 100, // 文件最大容纳值
                backups: 3,
            },
            render: { type: 'logLevelFilter', level: 'debug', appender: 'renderFileLog' },

            //错误日志 type:过滤类型logLevelFilter,将过滤error日志写进指定文件
            renderErrorLog: {
                type: 'dateFile', //设置每天：以日期为单位,数据文件类型，dataFiel 注意设置pattern，alwaysIncludePattern属性
                filename: `${filePath}/${renderName}.error.log`, // 输出到文件的文件路径，注意最后/是文件名前缀，如果只写./logs则只会在应用程序根目录生成文件
                alwaysIncludePattern: true, //始终包含pattern
                keepFileExt: true, // 日志文件是否始终保持后缀
                pattern: 'yyyy-MM-dd', // 每天生成按这个格式拼接到filename后边
            },
            renderError: { type: 'logLevelFilter', level: 'error', appender: 'renderErrorLog' },
        },
        categories: {
            // 不同等级的日志追加到不同的输出位置：appenders: ['out', 'allLog']  categories 作为getLogger方法的键名对应
            default: { appenders: ['console', 'fileLog', 'error'], level: 'all' },
            [mainName]: { appenders: ['console', 'fileLog', 'error'], level: 'debug' },
            [renderName]: { appenders: ['console', 'fileLog', 'render', 'renderError'], level: 'debug' },
        },
    })
}

class Logger {
    instance = null
    config = {
        filePath: './logs',
        category: 'app',
        type: 'console',
        mainName: 'main',
        renderName: 'render',
    }

    constructor(instance, configs = {}) {
        this.instance = instance
        const config = { ...this.config, ...configs }
        this.config = config
        if (this.isLog4js()) {
            ipcMainEvent.on('Log', (_, args) => {
                const category = args?.category
                const log = log4js.getLogger(config.renderName)
                const data = [`[${category}]`, ...args.data]
                const fn = log[args?.level]
                if (typeof fn === 'function') {
                    fn.apply(log, data)
                }
            })
            log4configure(log4js, config)
            const log = log4js.getLogger(config.mainName)
            // logger4.level = 'info'
            this.instance = log
        }
    }
    isLog4js() {
        return this.config?.type === 'log4js'
    }
    init() {
        const { instance, config } = this
        const { category } = config
        const isWeb = !instance?.category

        console.trace = function () {
            const data = isWeb ? arguments : [`[${category}]`, ...arguments]
            instance.trace.apply(instance, data)
        }
        console.debug = function () {
            const data = isWeb ? arguments : [`[${category}]`, ...arguments]
            instance.debug.apply(instance, data)
        }
        console.log = function () {
            const data = isWeb ? arguments : [`[${category}]`, ...arguments]
            instance.debug.apply(instance, data)
        }
        console.info = function () {
            const data = isWeb ? arguments : [`[${category}]`, ...arguments]
            instance.info.apply(instance, data)
        }
        console.warn = function () {
            const data = isWeb ? arguments : [`[${category}]`, ...arguments]
            instance.warn.apply(instance, data)
        }
        console.error = function () {
            const data = isWeb ? arguments : [`[${category}]`, ...arguments]
            instance.error.apply(instance, data)
        }
        console.fatal = function () {
            const data = isWeb ? arguments : [`[${category}]`, ...arguments]
            instance.fatal.apply(instance, data)
        }
        console.info('logger.js init config:', JSON.stringify(config))
    }
}

module.exports = Logger
