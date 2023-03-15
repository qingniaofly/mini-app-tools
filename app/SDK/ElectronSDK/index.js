const serviceBox = require('./service')
const {ipcMainNativeEvent} = require('./event')

const electronSDK = {
    ipcMainNativeEvent,
    init(data) {
        serviceBox.init(data)
    },
}

module.exports = electronSDK
