const { zz123Service, kugouService } = require('./service')

const serviceBox = {
    service: zz123Service,
    serviceList: [zz123Service, kugouService],
    get: () => {
        return serviceBox.service
    },
    set: (service) => {
        serviceBox = service
    }
}

const musicService = {
    getListByTag: (tag, page) => {
        const service = serviceBox.get()
        // return kugouService.getListByTag(tag, page)
        return service.getListByTag(tag, page)
    },
    getMusicInfoById: (id) => {
        const service = serviceBox.get()
        return service.getMusicInfoById(id)
    },
    search: (keyword, page) => {
        const service = serviceBox.get()
        return service.search(keyword, page)
    }
}

module.exports = musicService