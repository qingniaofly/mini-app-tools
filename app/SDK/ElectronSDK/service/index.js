const musicService = require('./music')
const novelService = require('./novel')

const serviceBox = {
    init(data) {
        musicService.init()
        novelService.init(data)
    },
}

module.exports = serviceBox
