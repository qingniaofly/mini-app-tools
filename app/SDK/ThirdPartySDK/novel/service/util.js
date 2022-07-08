class ResultModel {
    code = 0  // 错误码

    success = 0 // 0和1 1代表成功

    data = null

    msg = '' // 错误信息

    source = '' // 来源
}


//小说信息
class NovelInfoModel {
    title = '' // 小说名称
    url = '' // 小说地址
    author = '' // 作者
    cover = '' // 封面
    chapterList = [] // 章节列表
    newChapter = '' // 最新章节
    newTime = '' // 最新更新时间
    newChapterUrl = '' // 最新章节地址
}

class NovelChapterInfoModel {
    title = '' // 章节名称
    url = '' // 章节地址
    content = '' // 内容
    prevUrl = '' // 上一章
    nextUrl = '' // 下一章
    contentsUrl = '' // 目录
}

module.exports = {
    ResultModel,
    NovelInfoModel,
    NovelChapterInfoModel
}