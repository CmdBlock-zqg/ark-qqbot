const axios = require('axios')
const schedule = require('node-schedule')

const conf = require('../conf')
const sender = require('../sender')

const broadcast = async (res) => {
    for (let user of conf.dailyNews.broadcast.users) {
        await sender.sendPrivateMessage(user, res)
    }
    for (let group of conf.dailyNews.broadcast.groups) {
        await sender.sendGroupMessage(group, res)
    }
}

const refresh = async () => {
    await axios({
        method: 'POST',
        url: 'https://www.cimidata.com/api/account/data_update/Vj5p9KZO',
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.38',
            'cookie': conf.dailyNews.cookie
        }
    })
}

const main = async () => {
    let date = new Date(Date.now())
    let y = date.getFullYear(),
        m = date.getMonth() + 1,
        d = date.getDate()
    let ms = m > 9 ? String(m) : '0' + m
        ds = d > 9 ? String(d) : '0' + d
    let res
    try {
        res = await axios({
            method: 'GET',
            url: `https://www.cimidata.com/api/stats/articles?page=1&page_size=20&bid=Vj5p9KZO&end_at=${y}-${ms}-${ds}&position=all`,
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36 Edg/93.0.961.38',
                'cookie': conf.dailyNews.cookie
            }
        })
    } catch(e) {
        await broadcast('获取新闻大失败！' + e)
        return
    }
    let url = ''
    for (let article of res.data.data.articles) {
        if (article.title.indexOf('今日简报') !== -1 && article.title.indexOf(`${m}月${d}日`) !== -1) {
            url = article.content_url
            break
        }
    }
    if (url === '') {
        await broadcast('获取新闻大失败！没找到今天的简报推送淦')
        return
    }
    res = await axios.get(url)
    res = res.data
    let startPos = res.indexOf('img_list'),
        endPos = res.indexOf('</div>', startPos)
    res = res.substring(startPos, endPos)
    startPos = res.indexOf('src="')
    endPos = res.indexOf('">', startPos)
    res = res.substring(startPos + 5, endPos)
    await broadcast(`[CQ:image,file=${res}]`)
}

module.exports = () => {
    schedule.scheduleJob('0 20 8 * * *', refresh) // 每天8：20
    schedule.scheduleJob('0 30 8 * * *', main) // 每天8：30
}