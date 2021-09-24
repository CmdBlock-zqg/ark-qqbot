const axios = require('axios')

const db = require('./db')
const conf = require('./conf')
const sender = require('./sender')

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms) })

const httpGet = async (url, params) => {
    let { data } = await axios({
        method: 'GET',
        url: url,
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.38',
            'cookie': conf.weibo.cookie
        },
        params: params
    })
    await sleep(1000 + Math.floor(Math.random() * 1000))
    return data
}

const formatText = (raw, urls) => {
    let text = raw
    text = text.replace('&quot;', '"')
    text = text.replace('&amp;', '&')
    text = text.replace('&lt;', '<')
    text = text.replace('&gt;', '>')
    text = text.replace('&nbsp;', ' ')
    let pics = {}
    for (let url of urls) {
        if (url.pic_infos) {
            text = text.replace(url.short_url, '')
            Object.assign(pics, url.pic_infos)
        } else {
            text = text.replace(url.short_url, `${url.url_title}(${url.long_url})`)
        }
    }
    return {
        text,
        pics
    }
}

const formatPics = (pics) => {
    let res = []
    for (let i of Object.keys(pics)) {
        res.push(`[CQ:image,file=${pics[i].original.url}]`)
    }
    return res
}

const blogToMsg = async (blog) => {
    let res = ''
    let pics = blog.pic_infos ? blog.pic_infos : {}
    if (blog.continue_tag) {
        let longText = await httpGet('https://weibo.com/ajax/statuses/longtext', { id: blog.mblogid })
        let ret = formatText(longText.data.longTextContent, longText.data.url_struct ? longText.data.url_struct : [])
        res = ret.text
        Object.assign(pics, res.pics)
    } else {
        let ret = formatText(blog.text_raw, blog.url_struct ? blog.url_struct : [])
        res = ret.text
        Object.assign(pics, ret.pics)
    }
    return {
        text: res,
        pics: formatPics(pics)
    }
}

const formatVideo = (blog) => {
    if (blog.page_info && blog.page_info.media_info) {
        let url = blog.page_info.media_info.stream_url
        url = url.replace('&', '&amp;')
        url = url.replace('[', '&#91;')
        url = url.replace(']', '&#93;')
        url = url.replace(',', '&#44;')
        return `[CQ:video,file=${url}]`
    } else {
        return ''
    }
}

const main = async () => {
    let users = conf.weibo.userIdList
    await db.setNX('last_weibo_id', '4684612855399759')
    let lastId = Number(await db.get('last_weibo_id'))
    let maxId = 0
    for (let user of users) {
        let blogs = await httpGet('https://weibo.com/ajax/statuses/mymblog', {
            uid: user,
            page: 1,
            feature: 1
        })
        for (let blog of blogs.data.list) {
            if (blog.id <= lastId || blog.retweeted_status) continue
            if (blog.id > maxId) maxId = blog.id
            let resText = await blogToMsg(blog)
            let resPics = resText.pics
            resText = resText.text
            let resVideo = formatVideo(blog)
            let msgs = [resText]
            let forward = [{
                uin: conf.id,
                name: '发饼',
                content: resText
            }]
            for (let pic of resPics) {
                forward.push({
                    uin: conf.id,
                    name: '发饼',
                    content: pic
                })
                msgs.push(pic)
            }
            if (resVideo) {
                forward.push({
                    uin: conf.id,
                    name: '发饼',
                    content: resVideo
                })
                msgs.push(resVideo)
            }
            for (let user of conf.weibo.broadcast.users) {
                sender.sendPrivateMessage(user, msgs)
            }
            for (let group of conf.weibo.broadcast.groups) {
                await sender.sendGroupMessage(group, msgs)
                await sender.sendGroupForwardMessage(group, forward)
            }
        }
    }
    if (maxId > lastId) {
        await db.set('last_weibo_id', String(maxId))
    }
}

module.exports = main