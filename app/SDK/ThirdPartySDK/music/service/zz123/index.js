const { http } = require('../../../http/index.js')
const { parseServiceResponse } = require('./util')

// act=songinfo&id=zumsuq&lang=
// act=search&key=a&lang=
// https://www.zz123.com/list/mszm.htm?_pjax=%23pjaxcontent
// act=tag_music&type=tuijian&tid=mszm&lang=&page=2
// https://www.zz123.com/list/qda.htm?_pjax=%23pjaxcontent

const zz123Config = {
    name: 'zz123',
    url: 'https://www.zz123.com/ajax/',
    tags: ['mszm', 'qda'],
}

const zz123Service = {
    getListByTag: (tag, page) => {
        const option = {
            act: 'tag_music',
            type: 'tuijian',
            lang: '',
            tid: tag || zz123Config.tags[0],
            page: page || 1,
        }
        const url = zz123Config.url
        return http.post(url, option).then((resp) => {
            const source = zz123Config.name
            const data = { ...resp, source }
            const result = parseServiceResponse(data, 'getListByTag')
            return result
        })
    },

    getMusicInfoById: (id) => {
        const option = {
            act: 'songinfo',
            lang: '',
            id,
        }
        const url = zz123Config.url
        return http.get(url, option).then((resp) => {
            const source = zz123Config.name
            const data = { ...resp, source }
            const result = parseServiceResponse(data, 'getMusicInfoById')
            return result
        })
    },

    search: (keyword, page) => {
        const option = {
            act: 'search',
            lang: '',
            key: keyword,
            page: page || 1,
        }
        const url = zz123Config.url
        return http.post(url, option).then((resp) => {
            const source = zz123Config.name
            const data = { ...resp, source }
            const result = parseServiceResponse(data, 'search')
            return result
        })
    },
}

module.exports = {
    zz123Config,
    zz123Service,
}
