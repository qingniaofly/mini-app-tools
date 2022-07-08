const fs = require('fs-extra')

const fileUtil = {
    createFile(path) {
        return fs.ensureFile(path)
    },

    writeFile(path, data) {
        return fs.outputFile(path, data)
    },
}

module.exports = fileUtil
