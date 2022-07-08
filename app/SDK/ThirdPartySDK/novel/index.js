const { biqugeService } = require('./service')

const serviceBox = {
    service: biqugeService,
    serviceList: [biqugeService],
    get: () => {
        return serviceBox.service
    },
    set: (service) => {
        serviceBox.service = service
    },
}

const novelService = {
    getList: () => {
        const service = serviceBox.get()
        return service.getList()
    },
    getChapterList: (url) => {
        const service = serviceBox.get()
        return service.getChapterList(url)
    },
    getChapterInfo: (url) => {
        const service = serviceBox.get()
        return service.getChapterInfo(url)
    },
    search: (keyword, page) => {
        const service = serviceBox.get()
        return service.search(keyword, page)
    },
    download: (url) => {
        const service = serviceBox.get()
        return service.download(url)
    },
}

module.exports = novelService
