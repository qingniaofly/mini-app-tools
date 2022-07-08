const { ResultModel, NovelInfoModel, NovelChapterInfoModel } = require('../util')
const cheerio = require('cheerio')

function parseServiceResponse(data, type) {
    const resultModel = new ResultModel()
    resultModel.source = data.source
    switch (type) {
        case 'getList':
        case 'getChapterList':
        case 'getChapterInfo':
        case 'search':
            if (data?.html) {
                resultModel.success = 1
            } else {
                resultModel.code = -1
                resultModel.msg = 'error'
            }
            break
        default:
            break
    }
    switch (type) {
        case 'getList':
            if (data?.html) {
                resultModel.success = 1
                resultModel.data = parseNovelList(data)
            }
            break
        case 'getChapterList':
            if (data?.html) {
                resultModel.success = 1
                resultModel.data = parseNovelChapterList(data)
            }
            break
        case 'getChapterInfo':
            if (data?.html) {
                resultModel.success = 1
                resultModel.data = parseNovelChapterInfo(data)
            }
            break
        case 'search':
            if (data?.html) {
                resultModel.success = 1
                resultModel.data = parseSearchNovelList(data)
            }
            break
        default:
            break
    }
    return resultModel
}

function parseHtmlTo$(html) {
    return cheerio.load(html)
    // return cheerio.load(html, { decodeEntities:false });
}

function parseNovelChapterList(data) {
    const { html, baseUrl, novelUrl } = data || {}
    const $ = parseHtmlTo$(html)
    const novel = new NovelInfoModel()
    const $mainInfo = $('#maininfo')
    const $info = $mainInfo.find('#info')
    novel.title = $info.find('h1').eq(0).text()
    novel.author = $info.find('p').eq(0).text()
    novel.url = novelUrl

    const list = []
    const $chapterList = $('#list')
    const $rows = $chapterList.find('dl dd')
    $rows.each((index, column) => {
        const $column = $(column)
        const chapter = new NovelChapterInfoModel()
        chapter.title = $column.text()
        const url = $column.find('a').eq(0).attr('href')
        chapter.url = `${baseUrl}${url}`
        list.push(chapter)
    })
    novel.chapterList = list
    return novel
}

function parseNovelChapterInfo(data) {
    const { html, baseUrl, chapterUrl } = data || {}
    const $ = parseHtmlTo$(html)
    const chapter = new NovelChapterInfoModel()

    const $bookname = $('.bookname')
    const title = $bookname.find('h1').eq(0).text()
    chapter.title = title
    chapter.url = chapterUrl

    const $bottem = $('.bottem1')
    const $info2 = $bottem.find('a')
    if ($info2.length >= 4) {
        // 上一章
        const prevUrl = $info2.eq(1).attr('href')
        chapter.prevUrl = `${baseUrl}${prevUrl}`
        // 目录
        chapter.contentsUrl = $info2.eq(2).attr('href')
        // 下一章
        const nextUrl = $info2.eq(3).attr('href')
        chapter.nextUrl = `${baseUrl}${nextUrl}`
    }

    const $content = $('#content')
    chapter.content = $content.html()
    return chapter
}

function parseNovelList(data) {
    const { html } = data || {}
    const list = []
    const $ = parseHtmlTo$(html)
    const $novelList = $('.novellist')
    const $rows = $novelList.find('ul li')
    $rows.each((index, column) => {
        const $colum = $(column)
        const novel = parseNovelInfo($colum)
        list.push(novel)
    })
    return list
}

function parseNovelInfo($column) {
    const novel = new NovelInfoModel()
    novel.title = $column.text()
    novel.url = $column.find('a').eq(0).attr('href')
    return novel
}

function parseSearchNovelList(data) {
    const { html } = data || {}
    const list = []
    const $ = parseHtmlTo$(html)
    const $table = $('#checkform table')
    const $rows = $table.find('tr')
    $rows.each((index, tr) => {
        const $columns = $(tr).find('td')
        const novel = parseSearchNovelInfo($columns)
        if ($columns.length === 4 && novel) {
            list.push(novel)
        }
    })
    return list
}

function parseSearchNovelInfo($columns) {
    if ($columns.length === 4) {
        const novel = new NovelInfoModel()
        novel.title = $columns.eq(0).text()
        novel.url = $columns.eq(0).find('a').eq(0).attr('href')
        novel.author = $columns.eq(2).text()
        novel.newChapter = $columns.eq(1).text()
        novel.newTime = $columns.eq(3).text()
        novel.newChapterUrl = $columns.eq(3).find('a').eq(0).attr('href')
        return novel
    }
    return null
}

module.exports = {
    parseServiceResponse,
}
