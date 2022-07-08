const musicService = require('./music')
const novelService = require('./novel')
const storeService = require('./store')
const httpService = require('./http')

const sdkService = {
    musicService,
    novelService,
    storeService,
    httpService,
}

module.exports = sdkService
