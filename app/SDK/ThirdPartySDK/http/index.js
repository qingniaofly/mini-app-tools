const { BaseHttp } = require('./util')
const axios = require('./axios.js')
const nodeFetch = require('./node-fetch.js')

const E_HTTP_TYPE = {
    NODE_FETCH: 'node-fetch',
    AXIOS: 'axios',
}

const httpConfig = {
    use: E_HTTP_TYPE.NODE_FETCH,
}

const httpMap = new Map()
httpMap.set(E_HTTP_TYPE.NODE_FETCH, nodeFetch)
httpMap.set(E_HTTP_TYPE.AXIOS, axios)

const httpManager = {
    get() {
        const r = httpMap.get(httpConfig.use)
        return r || httpMap.get(E_HTTP_TYPE.NODE_FETCH)
    },

    set(name, http) {
        httpConfig.use = name
        if (http && http instanceof BaseHttp) {
            httpMap.set(name, http)
        }
    },
}

const http = {
    get(url, params, config) {
        const _http = httpManager.get()
        return _http.get(url, params, config)
    },
    post(url, params, config) {
        const _http = httpManager.get()
        return _http.post(url, params, config)
    },
    getHtml(url, params, config) {
        const _http = httpManager.get()
        return _http.getHtml(url, params, config)
    },
    postHtml(url, params, config) {
        const _http = httpManager.get()
        return _http.postHtml(url, params, config)
    },
}

module.exports = {
    BaseHttp,
    httpManager,
    http,
}
