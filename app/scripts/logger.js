const iconv = require("iconv-lite")
const BufferHelper = require('bufferhelper');

function getStringsInParams(args) {
    const length = args.length
    let i = 0
    let wholeStr = ''
    for (; i < length; i++) {
        let argObj = args[i]
        if (typeof(argObj) === 'object') {
            try {
                 argObj = JSON.stringify(argObj)
            } catch (error) {
                argObj = 'parse object error!'
            }
        }
        wholeStr += argObj
    }
    return wholeStr
}

function decode(str, type) {
    const bufferHelper = new BufferHelper()

    bufferHelper.concat(str);

    return str
    return iconv.decode(bufferHelper.toBuffer(),'utf8')



    console.log(iconv.encodingExists("utf8"))
    str = iconv.decode(Buffer.from(str), 'gb2312');
    html = iconv.encode(str, 'utf8').toString();
    return html
    type = type || 'gb2313'
    const binary = Buffer.from(str, 'binary')
    return iconv.decode(binary, type)
}


const log = console.log
const info = console.info
const warn = console.warn
const error = console.error

const logger = {
    init() {
        console.log = function() {
            const data =  {
                level: 1,
                message: (getStringsInParams(arguments))
            }
            log.call(console, data)
        }
        
        console.info = function() {
            const data =  {
                level: 2,
                message: getStringsInParams(arguments)
            }
            info.call(console, data)
        }
        
        console.warn = function() {
            const data =  {
                level: 3,
                message: getStringsInParams(arguments)
            }
            warn.call(console, data)
        }
        
        console.error = function() {
            const data =  {
                level: 4,
                message: getStringsInParams(arguments)
            }
            error.call(console, data)
        }
    }
}

module.exports = logger