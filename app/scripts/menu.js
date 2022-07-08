const { Menu, BrowserWindow } = require('electron')
const { routeUtil } = require('./route.js')
const { MainWindow } = require("./window/mainWindow")

const template = [
    {
        // id: 1,
        label:'文件',
        submenu:[
            {
                // id: 11,
                label:'关于',
                click(){
                    routeUtil.push('/about')
                }
            },
            {
                // id: 11,
                label:'音乐',
                click(){
                    routeUtil.push('/music')
                }
            },
            {
                // id: 11,
                label:'小说',
                click(){
                    routeUtil.push('/novel')
                }
            },
            {
                // id: 11,
                label:'打开调试',
                click(){
                    console.log("openDevTools")
                    const mainWindow = MainWindow.get()
                    mainWindow.webContents.openDevTools()
                    console.log("openDevTools2")
                }
            },
            {
                // id: 11,
                label:'测试2',
                click(){
                    // requestTest2()
                }
            },
            {
                // id: 12,
                type:'separator'
            },
            {
                // id: 13,
                label:'关闭',
                accelerator:'Command+Q',
                click:()=>{
                    // win.close();
                }
            }
        ]
    },
    {
        // id: 2,
        label:'编辑',
        submenu:[
            {
                id: 21,
                label:'复制',
                click:(...args)=>{
                    console.log('copy', args);
                }
            },
            {
                // id: 22,
                label:'剪切',
                click:()=>{
                    console.log('剪切');
                }
            },
            {
                type:'separator'
            },
            {
                label:'查找',
                accelerator:'Command+F',
                click:()=>{
                    console.log('查找');
                }
            },
            {
                label:'替换',
                accelerator:'Command+R',
                click:()=>{
                    console.log('替换');
                }
            }

        ]
    }
];
const menus = Menu.buildFromTemplate(template)
module.exports = { menus }
class MenuUtil {
    constructor() {

    }
}