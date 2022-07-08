import { registerMicroApps, setDefaultMountApp, start, initGlobalState, RegistrableApp } from "qiankun"
import microApps, { RegistrableAppInfo } from "./qiankun.config"
import axios from 'axios'
import path from "path"
// const fs = require('fs-extra')

class QianKunUtil {
    constructor() {
        //
    }

    init(initialState: any, loader: (loading: boolean) => void) {
        console.log('QianKunUtil.ts init')
        const apps = this.getApps(loader)

        // 注册所有子应用
        this.registerMicroApps(apps)

        // 初始化全局state
        const actions = this.initGlobalState(initialState)

        // 默认进入页
        // const defaultUrl = `/purehtml`
        // this.setDefaultMountApp(defaultUrl)

        // 启动应用
        this.start({
            prefetch: false, // 关闭预加载
        })
        return actions
    }

    private start(config?: { prefetch: boolean }) {
        console.log('QianKunUtil.ts start')
        // 启动应用
        start({
            ...config,
            async fetch(url: string, ...args) {
                if (url && url.indexOf('subapp') > -1) {
                    // const fileUrl = E:/taoyangchao/project/electron/electron-app/release/subapp/purehtml/index.html
                    const fileUrl = path.resolve(window.__dirname, url)
                    console.log('QuanKun.ts start fetch import data=', url ,args, fileUrl)
                    // return fs.readFileSync(fileUrl, 'utf8')
                  return axios.get(fileUrl + "index.html")
                }
        
                console.log('QuanKun.ts start fetch data=', url ,args)
                return window.fetch(url, ...args);
            },
        })
    }

    private setDefaultMountApp(url: string) {
        // 默认进入页面
        setDefaultMountApp(url)
    }

    private getApps(loader: (loading: boolean) => void) {
        const apps: RegistrableApp<RegistrableAppInfo>[] = microApps.map(app => {
            return { ...app, loader }
        })
        return apps
    }

    private registerMicroApps(apps: RegistrableApp<RegistrableAppInfo>[]) {
        registerMicroApps(apps, {
            beforeLoad: [
                (app: { name: string }) => {
                    console.log("[LifeCycle] before load %c%s", "color: green;", app.name) //eslint-disable-line
                    return Promise.resolve(app)
                }
            ],
            beforeMount: [
                (app: { name: string }) => {
                    console.log("[LifeCycle] before mount %c%s", "color: green;", app.name) //eslint-disable-line
                    return Promise.resolve(app)
                }
            ],
            afterUnmount: [
                (app: { name: string }) => {
                    console.log("[LifeCycle] after unmount %c%s", "color: green;", app.name) //eslint-disable-line
                    return Promise.resolve(app)
                }
            ]
        })
    }

    private initGlobalState(initialState: Record<string, any>) {
        // 初始化全局state
        const actions = initGlobalState()
        // 设置全局state
        actions.setGlobalState(initialState)
        return actions
    }
}

export default new QianKunUtil()