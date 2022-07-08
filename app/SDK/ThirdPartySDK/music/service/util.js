class ResultModel {
    code = 0  // 错误码

    success = 0 // 0和1 1代表成功

    data = null

    msg = '' // 错误信息

    source = '' // 来源
}


// 歌曲信息
class MusicInfoModel {
    id = '' // 歌曲id
    cover = '' // 歌曲封面
    name = '' // 歌曲名称
    src = '' // 歌曲地址
    songer = '' // 歌手
    time = '' // 歌曲时长
    lyric = '' // 歌词
    tag = '' // 标签id
    desc = ''
}

module.exports = {
    ResultModel,
    MusicInfoModel
}