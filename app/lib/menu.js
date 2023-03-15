const { Menu, BrowserWindow } = require('electron')
const routeUtil = require('./route')
const { config } = require('../config')

const menuList = config.get('menus').map((menu) => {
    const children = Array.isArray(menu?.children) ? menu?.children : []
    return {
        label: menu.name,
        submenu: children.map((submenu) => {
            let click = submenu.url
                ? () => {
                      routeUtil.push(submenu.url)
                  }
                : undefined
            if (submenu.key === 'openDevTools') {
                click = () => {
                    const focusedWindow = BrowserWindow.getFocusedWindow()
                    if (focusedWindow) {
                        focusedWindow.webContents.openDevTools()
                    }
                }
            }
            return {
                label: submenu.name,
                click,
            }
        }),
    }
})

const menus = Menu.buildFromTemplate(menuList)
module.exports = { menus }
