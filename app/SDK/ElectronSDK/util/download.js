const path = require('path')
const fileUtil = require('./file')

const downloadUtil = {
    downloadUrl: __dirname,
    downloadNovel: async (data) => {
        if (!data.success) {
            return { code: -2 }
        }
        const novelName = data?.data?.title
        const fileName = `${novelName}.txt`
        const novelChapterList = Array.isArray(data?.data?.chapterList) ? data?.data?.chapterList : []
        // console.log('downloadNovel', novelChapterList)
        const content = novelChapterList.reduce((str, chapter) => {
            str += chapter.title
            str += '\n'
            const content = (chapter.content || '').replace(/<br>/g, '').replace(/&nbsp;/g, '')
            str += content
            return str
        }, '')
        const fileUrl = path.join(downloadUtil.downloadUrl, `../download/novel/${fileName}`)
        const result = await fileUtil
            .writeFile(fileUrl, content)
            .then((result) => {
                return { code: 0, ...result }
            })
            .catch((err) => {
                return { code: -1, ...err }
            })
        return { downloadUrl: downloadUtil.downloadUrl, fileUrl, ...result }
    },
}

module.exports = downloadUtil
