const { ResultModel, MusicInfoModel } = require("../util")

function parseServiceResponse(data, type) {
    const resultModel = new ResultModel()
    resultModel.source = data.source
    switch(type) {
        case 'getListByTag':
        case 'getMusicInfoById':
        case 'search':
            if (data?.status === 200) {
                resultModel.success = 1
            } else {
                resultModel.code = -1
                resultModel.msg = 'error'
            }
            break
        default:
            break
    }
    switch(type) {
        case 'getListByTag':
        case 'search':
            if (data?.status === 200) {
                resultModel.success = 1
                resultModel.data = parseMusicList(data?.data)
            } 
            break
        case 'getMusicInfoById':
            if (data?.status === 200) {
                resultModel.success = 1
                resultModel.data = parseMusicInfo(data?.data)
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
    music.id = item.id,
    music.name = item.mname,
    music.cover = item.pic,
    music.src = item.mp3,
    music.songer = item.sname,
    music.time = item.play_time,
    music.lyric = item.lrc
    return music
}

module.exports = {
    parseServiceResponse,
    parseMusicList,
    parseMusicInfo
}