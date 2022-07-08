const { http } = require('../../../http/index.js')
const { parseServiceResponse } = require('./util')
const _ = require('loadsh')

const biqugeConfig = {
    name: 'biquge',
    url: 'https://www.xbiquge.la',
    searchUrl: '/modules/article/waps.php',
    tag: ['xiaoshuodaquan'],
}

const biqugeService = {
    getList: (tag) => {
        const source = biqugeConfig.name
        const baseUrl = biqugeConfig.url
        url = `${baseUrl}/xiaoshuodaquan/`
        return http.postHtml(url).then((resp) => {
            const data = { html: resp, source, baseUrl }
            const result = parseServiceResponse(data, 'getList')
            return result
        })
    },

    getChapterList: (url) => {
        // url = url || 'https://www.xbiquge.la/66/66747/'
        return http.getHtml(url).then((resp) => {
            const source = biqugeConfig.name
            const baseUrl = biqugeConfig.url
            const data = { html: resp, source, baseUrl, novelUrl: url }
            const result = parseServiceResponse(data, 'getChapterList')
            return result
        })
    },

    getChapterInfo: (url) => {
        // url = url || 'https://www.xbiquge.la/66/66747/26551937.html'
        return http.getHtml(url).then((resp) => {
            const source = biqugeConfig.name
            const baseUrl = biqugeConfig.url
            const data = { html: resp, source, baseUrl, chapterUrl: url }
            const result = parseServiceResponse(data, 'getChapterInfo')
            return result
        })
    },

    download: (url) => {
        return biqugeService.getChapterList(url).then(async (result) => {
            const novelChapterList = Array.isArray(result?.data?.chapterList) ? result?.data?.chapterList : []
            const allRequestList = novelChapterList.map((chapter) => {
                return () => {
                    // console.log('download promiseAllList allRequestList=', chapter.url)
                    return biqugeService.getChapterInfo(chapter.url).then((r) => r?.data)
                }
            })
            for (let i = 0, len = allRequestList.length; i < len; i++) {
                const request = allRequestList[i]
                // if (i > 1) {
                //     break
                // }
                const info = await request()
                const index = novelChapterList.findIndex((r) => r?.url === info?.url)
                // console.log('info.url=', info.url, index)
                if (index > -1) {
                    novelChapterList[index].content = info.content
                }
            }
            // _.forEach(allRequestList, async (request, i) => {
            //     if (i > 1) {
            //         return
            //     }
            //     const info = await request()
            //     const index = novelChapterList.findIndex((r) => r?.url === info.url)
            //     console.log('info.url=', info.url, index)
            //     if (index > -1) {
            //         novelChapterList[index].content = info.content
            //     }
            // })
            // console.log('novelChapterList=', novelChapterList)
            // const allPromiseList = _.chunk(allRequestList, 30).map((requestList) => {
            //     return () => {
            //         // console.log('download promiseAllList allPromiseList do it')
            //         Promise.all(requestList.map((fn) => fn())).then((result) => {
            //             // console.log('download promiseAllList requestList=', result.length)
            //             return result
            //         })
            //     }
            // })
            // const list = await Promise.all(allPromiseList.map((fn) => fn())).then((result) => {
            //     const resultList = _.isArray(result) ? result : []
            //     console.log('download promiseAllList resultList=', resultList.length)
            //     _.forEach(resultList, (resp) => {
            //         const respList = _.isArray(resp) ? resp : []
            //         console.log('download promiseAllList respList=', respList.length)
            //         _.forEach(respList, (info, i) => {
            //             // console.log('download promiseAllList respList=', i)
            //             const index = novelChapterList.findIndex((r) => r?.url === info.url)
            //             if (index > -1) {
            //                 novelChapterList[index].content = info.content
            //             }
            //         })
            //     })
            // })
            // console.log('download promiseAllList list', list?.length)
            return result
        })
    },

    search: (keyword, page) => {
        const param = {
            searchkey: keyword,
            page: page || 1,
        }
        const url = `${biqugeConfig.url}${biqugeConfig.searchUrl}`
        return http.postHtml(url, param).then((resp) => {
            const source = biqugeConfig.name
            const data = { html: resp, source, baseUrl }
            const result = parseServiceResponse(data, 'search')
            return result
        })
    },
}

module.exports = {
    biqugeConfig,
    biqugeService,
}
