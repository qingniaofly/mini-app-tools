const nodeFetch = import('node-fetch').then((module) => module.default)
const request = (...args) => nodeFetch.then((fetch) => fetch(...args))
const { BaseHttp, parseParam } = require('./util')

class Http extends BaseHttp {
    get(url, params, config) {
        const param = params || {}
        const formData = parseParam(param)
        const options = {
            ...config,
            method: 'get',
        }
        const p = formData.toString()
        url = p ? `${url}?${p}` : url
        return new Promise((resolve, reject) => {
            request(url, options)
                .then(function (response) {
                    response
                        .json()
                        .then((data) => {
                            // console.log(`node-fetch get response.json() data=${JSON.stringify(data)}`);
                            resolve(data)
                        })
                        .catch((err) => {
                            console.log(`node-fetch get response.json() error=${JSON.stringify(err)}`)
                            resolve(err)
                        })
                })
                .catch(function (err) {
                    console.log(`node-fetch get error=${JSON.stringify(err)}`)
                    resolve(err)
                })
        })
    }
    post(url, params, config) {
        const param = params || {}
        const formData = parseParam(param)
        const { headers, timeout, ...args } = config || {}
        const options = {
            ...config,
            method: 'post',
            body: formData,
        }
        return new Promise((resolve, reject) => {
            request(url, options)
                .then(function (response) {
                    response
                        .json()
                        .then((data) => {
                            // console.log(`node-fetch post response.json() data=${JSON.stringify(data)}`);
                            resolve(data)
                        })
                        .catch((err) => {
                            console.log(`node-fetch post response.json() error=${JSON.stringify(err)}`)
                        })
                })
                .catch(function (err) {
                    console.log(`node-fetch post error=${JSON.stringify(err)}`)
                    resolve(err)
                })
        })
    }
    getHtml(url, params, config) {
        const param = params || {}
        const formData = parseParam(param)
        const options = {
            ...config,
            method: 'get',
        }
        const p = formData.toString()
        url = p ? `${url}?${p}` : url
        return new Promise((resolve, reject) => {
            request(url, options)
                .then(function (response) {
                    if (response.ok) {
                        response
                            .text()
                            .then((data) => {
                                // console.log(`node-fetch getHtml response.text() data=${JSON.stringify(data)}`);
                                resolve(data)
                            })
                            .catch((err) => {
                                resolve(err)
                                console.log(`node-fetch getHtml response.text() error=${JSON.stringify(err)}`)
                            })
                    } else {
                        resolve(data)
                    }
                })
                .catch(function (err) {
                    console.log(`node-fetch getHtml error=${JSON.stringify(err)}`)
                    resolve(err)
                })
        })
    }
    postHtml(url, params, config) {
        const param = params || {}
        const formData = parseParam(param)
        const options = {
            ...config,
            method: 'post',
            body: formData,
        }
        return new Promise((resolve, reject) => {
            request(url, options)
                .then(function (response) {
                    if (response.ok) {
                        response
                            .text()
                            .then((data) => {
                                // console.log(`node-fetch postHtml response.text() data=${JSON.stringify(data)}`);
                                resolve(data)
                            })
                            .catch((err) => {
                                resolve(err)
                                console.log(`node-fetch postHtml response.text() error=${JSON.stringify(err)}`)
                            })
                    } else {
                        resolve(data)
                    }
                })
                .catch(function (err) {
                    console.log(`node-fetch postHtml error=${JSON.stringify(err)}`)
                    resolve(err)
                })
        })
    }
}
const http = new Http()

module.exports = http
