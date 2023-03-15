const path = require('path')
const fs = require('fs')

const NODE_ENV = process.env.NODE_ENV
const isDebug = NODE_ENV === 'development'
function readConfig(filePath) {
    let errorInfo = {}
    let configPath = ''
    try {
        configPath = isDebug ? path.join(__dirname, filePath) : path.join(process.cwd(), filePath)
    } catch (e) {
        errorInfo['configPath'] = e
    }
    let configData = ''
    try {
        configData = fs.readFileSync(configPath, 'utf-8')
    } catch (e) {
        errorInfo['configData'] = e
    }
    let configJSON = {}
    try {
        configJSON = JSON.parse(configData)
    } catch (e) {
        errorInfo['configJSON'] = e
    }
    return { configPath, configData, configJSON, configError: errorInfo }
}

let configJSON = null
class Config {
    filePath = './config.json'
    configInfo = {
        configPath: '',
        configData: '',
        configJSON: {},
        mainPath: './',
        mainUrl: '/index.html',
        openDevTools: false,
        menus: [],
        logFilePath: '',
    }

    constructor() {
        this.load()
    }

    load() {
        const configInfo = { ...this.configInfo, ...readConfig(this.filePath) }
        const { configJSON } = configInfo
        const mainPath = path.join(__dirname, `${configJSON?.baseUrl}${configJSON?.filePath}`)
        const mainUrl = `${mainPath}${configJSON?.mainUrl}` + configJSON?.mainRoute
        const openDevTools = !!configJSON?.openDevTools
        const menus = Array.isArray(configJSON?.menus) ? configJSON.menus : []
        const logFilePath = configJSON?.logFilePath
        const config = this.configInfo
        config.mainPath = mainPath
        config.mainUrl = mainUrl
        config.openDevTools = openDevTools
        config.menus = menus
        config.logFilePath = logFilePath
    }

    get(key) {
        if (!key) {
            return this.configInfo
        }
        return this.configInfo[key]
    }

    log() {
        console.log('config.js NODE_ENV:', NODE_ENV)
        console.log('config.js init:', JSON.stringify(this.get()))
    }

    reload() {
        this.load()
    }

    init() {
        let configInfo = {}
        if (!configJSON) {
            configInfo = readConfig()
            configJSON = configInfo.configJSON
        }
        const mainPath = path.join(__dirname, `${configJSON?.baseUrl}${configJSON?.filePath}`)
        const mainUrl = `${mainPath}${configJSON?.mainUrl}` + configJSON?.mainRoute
        console.log('config.js init:', JSON.stringify(configJSON))
        const openDevTools = !!configJSON?.openDevTools
        const menus = Array.isArray(configJSON?.menus) ? configJSON.menus : []
        const logFilePath = configJSON?.logFilePath

        return { ...configInfo, mainPath, mainUrl, openDevTools, menus, logFilePath }
    }
}

module.exports = {
    isDebug,
    config: new Config(),
}
