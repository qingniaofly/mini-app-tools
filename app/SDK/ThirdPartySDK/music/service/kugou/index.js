const { http } = require("../../../http/index.js")
const { parseServiceResponse } = require("./util")

// t={sortId}&c=${标签}&p=${分页}
//http://www2.kugou.kugou.com/yueku/v9/special/getSpecial?is_ajax=1&cdn=cdn&t=5&c=&p=1 

// http://www2.kugou.kugou.com/yueku/v9/special/single/${id}-5-9999.html
// 取到body, 
const regExps = {
    listData: /global\.data = (\[.+\]);/,
    listInfo: /global = {[\s\S]+?name: "(.+)"[\s\S]+?pic: "(.+)"[\s\S]+?};/,
    // https://www.kugou.com/yy/special/single/1067062.html
    listDetailLink: /^.+\/(\d+)\.html(?:\?.*|&.*$|#.*$|$)/,
}
// let listData = body.match(this.regExps.listData)

const sortList = [
    {
      name: '推荐',
      id: '5',
    },
    {
      name: '最热',
      id: '6',
    },
    {
      name: '最新',
      id: '7',
    },
    {
      name: '热藏',
      id: '3',
    },
    {
      name: '飙升',
      id: '8',
    },
  ]

const kugouConfig = {
    name: 'kugou',
    url: 'http://www2.kugou.kugou.com/yueku/v9/special',
    tags: ['mszm', 'qda'],
}

const kugouService = {

    getListByTag: (tag, page) => {
        const option = {
            is_ajax: '1',
            cdn: 'cdn',
            t: 5, // sordIf
            c: '',
            p: 1 
        }
        const url = kugouConfig.url
        return http.post(url, option).then(resp => {
            const source = kugouConfig.name
            const data = { ...resp, source }
            const result = parseServiceResponse(data, 'getListByTag')
            return result
        })
    },

    getMusicInfoById: (id) => {
        const option = {
            act: 'songinfo',
            lang: '',
            id: id || 'zumsuq'
        }
        const url = kugouConfig.url
        return http.post(url, option).then(resp => {
            const source = kugouConfig.name
            const data = { ...resp, source }
            const result = parseServiceResponse(data, 'getMusicInfoById')
            return result
        })
    },

    search: (keyword, page) => {
        // act=search&key=a&lang=
        const option = {
            act: 'search',
            lang: '',
            key: keyword || 'test',
            page: page || 1
        }
        const url = kugouConfig.url
        return http.post(url, option).then(resp => {
            const source = kugouConfig.name
            const data = { ...resp, source }
            const result = parseServiceResponse(data, 'search')
            return result
        })
    }
}

module.exports = {
    kugouConfig,
    kugouService
}