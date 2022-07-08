const axios = require('axios')
const { BaseHttp, parseToFormData } = require('./util')
// 在nodejs中使用axios回调必须使用await，否则在nodejs中会报错

const request = axios.create({
    adapter: require('axios/lib/adapters/http'),
    timeout: 3000,
    transformRequest: [
        function (data, headers) {
            // 对 data 进行任意转换处理
            // console.log(`axios.js transformRequest data=${JSON.stringify(data)}`)
            return data
        },
    ],
})

request.interceptors.request.use(
    function (config) {
        // console.log(`axios.js interceptors.request config=${JSON.stringify(config)}`)
        return config
    },
    function (error) {
        console.log(`axios.js interceptors.request error=${JSON.stringify(error)}`)
        return Promise.reject(error)
    },
    { synchronous: true }
)

class Http extends BaseHttp {
    get(url, params, config) {
        const param = params || {}
        const options = {
            url,
            method: 'get',
            params: param,
            ...config,
        }
        return new Promise(async (resolve, reject) => {
            const res = await request(options)
            resolve(res?.data)
        })
    }
    post(url, params, config) {
        const param = params || {}
        const formData = parseToFormData(param)
        const options = {
            url,
            method: 'post',
            data: formData,
            ...config,
        }
        return new Promise(async (resolve, reject) => {
            const res = await request(options)
            resolve(res?.data)
        })
    }
    getHtml(url, params, config) {
        const configs = { ...config }
        return http.get(url, params, configs)
    }
    postHtml(url, params, config) {
        const configs = { ...config }
        return http.post(url, params, configs)
    }
}
const http = new Http()
module.exports = http
