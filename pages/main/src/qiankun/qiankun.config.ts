import path from "path"

export interface RegistrableAppInfo {
    name: string
    entry: string
    container: string
    prefetch?: boolean
    activeRule: string | string[]
}

const PUBLIC_URL = "/#"

// console.log('sss', path.resolve(window.__dirname, '..//subapp//purehtml'))

// 子应用列表
const microApps: RegistrableAppInfo[] = [
    {
        name: "purehtml",
        entry: '//localhost:8099/#/purehtml',
        container: "#subapp",
        activeRule: [`${PUBLIC_URL}/purehtml`],
        // prefetch: true
    },
]


export default microApps
