class BaseHttp {
    get(url, params, config) {
        return new Promise()
    }
    post(url, params, config) {
        return new Promise()
    }
    getHtml(url, params, config) {
        return new Promise()
    }
    postHtml(url, params, config) {
        return new Promise()
    }
}

const FormData = global?.FormData || require('form-data')

const parseParam = (param) => {
    const formData = new URLSearchParams()
    for (let key in param) {
        formData.append(key, param[key])
    }
    return formData
}

const parseToFormData = (param) => {
    const formData = new FormData()
    for (let key in param) {
        formData.append(key, param[key])
    }
    return formData
}

module.exports = {
    parseParam,
    parseToFormData,
    BaseHttp,
}
