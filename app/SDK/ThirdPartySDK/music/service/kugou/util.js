const { ResultModel, MusicInfoModel } = require("../util")

function parseServiceResponse(data, type) {
    const resultModel = new ResultModel()
    resultModel.source = data.source
    switch(type) {
        case 'getListByTag':
            if (data?.status === 1) {
                resultModel.success = 1
                resultModel.data = parseMusicList(data?.special_db)
            } else {
                resultModel.code = -1
                resultModel.msg = 'error'
            }
            break
        default:
            break
    }

    return resultModel
}

function parseMusicList(data) {
    let list = []
    if (Array.isArray(data)) {
        list = data.map(music => parseMusicInfo(music))
    }
    return list
}

function parseMusicInfo(item) {
    const music = new MusicInfoModel()
    music.id = item?.specialid,
    music.name = item?.specialname,
    music.cover = item?.img,
    music.src = item?.mp3,
    music.songer = item?.nickname,
    music.time = item?.publish_time || item?.publishtime,
    music.lyric = item?.lrc
    music.desc = item.intro
    return music
}

module.exports = {
    parseServiceResponse
}