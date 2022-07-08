const serviceBox = require('./service')

const electronSDK = {
    init(data) {
        serviceBox.init(data)
    },
}

module.exports = electronSDK
