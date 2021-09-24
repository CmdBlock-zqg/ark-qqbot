const axios = require('axios')

const db = require('../db')
const conf = require('../conf')
const sender = require('../sender')

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms) })

const httpGet = async (url, params) => {
    let { data } = await axios({
        method: 'GET',
        url: url,
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.38',
        },
        params: params
    })
    await sleep(1000 + Math.floor(Math.random() * 1000))
    return data
}

const formatContent = (text) => {
    let res = []
    text = text.replace(/<br>/g, '\n')
    text = text.replace(/<\/p>/g, '\n')
    res.push('114514')
    res.push('1919810')
    while (true) {
        let pl = text.indexOf('src="')
        if (pl === -1) break
        let pr = text.indexOf('"', pl + 5)
        let picUrl = text.substring(pl + 5, pr)
        res.push(`[CQ:image,file=${picUrl}]`)
        text = text.replace(text.substring(pl, pr + 1), '')
    }
    while(true) {
        let pl = text.indexOf('<')
        if (pl === -1) break
        let pr = text.indexOf('>', pl)
        text = text.replace(text.substring(pl, pr + 1), '')
    }
    res[1] = text
    return res
}

const main = async () => {
    let newsList = await httpGet('https://monster-siren.hypergryph.com/api/news', {})
    for (let news of newsList.data.list) {
        if (await db.sIsMember('sirenNews_set', news.cid)) continue
        let data = await httpGet(`https://monster-siren.hypergryph.com/api/news/${news.cid}`, {})
        data = data.data
        let res = formatContent(data.content)
        res[0] = `[${data.author}#${data.cid}] ${data.title}`
        let forward = res.map((x) => { return {
            uin: conf.id,
            name: '发饼',
            content: x
        }})
        for (let user of conf.sirenNews.broadcast.users) {
            await sender.sendPrivateMessage(user, res)
        }
        for (let group of conf.sirenNews.broadcast.groups) {
            await sender.sendGroupMessage(group, res)
            await sender.sendGroupForwardMessage(group, forward)
        }
        await db.sAdd('sirenNews_set', news.cid)
    }
}

module.exports = () => {
    main()
    setInterval(main, conf.sirenNews.updateInterval)
}