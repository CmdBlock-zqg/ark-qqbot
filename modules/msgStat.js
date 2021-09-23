const schedule = require('node-schedule')
const axios = require('axios')

const conf = require('../conf')
const db = require('../db')
const sender = require('../sender')

schedule.scheduleJob('0 0 0 * * *', async () => { // 每天凌晨0点
    await db.del('msgStat_day')
})

schedule.scheduleJob('0 0 0 * * 1', async () => { // 每周一零点
    await db.del('msgStat_week')
})

schedule.scheduleJob('0 0 0 1 * *', async () => { // 每月一号零点
    await db.del('msgStat_month')
})

module.exports = async (msg, user, group, type) => {
    await db.hIncrBy('msgStat_all', String(user), 1)
    await db.hIncrBy('msgStat_all', '0', 1)
    await db.hIncrBy('msgStat_day', String(user), 1)
    await db.hIncrBy('msgStat_day', '0', 1)
    await db.hIncrBy('msgStat_week', String(user), 1)
    await db.hIncrBy('msgStat_week', '0', 1)
    await db.hIncrBy('msgStat_month', String(user), 1)
    await db.hIncrBy('msgStat_month', '0', 1)
    if (conf.msgStat.admin.indexOf(user) !== -1 && msg.indexOf('##统计' === 0)) {
        let hall
        switch (msg.split(' ')[1]) {
            case '全部':
                hall = await db.hGetAll('msgStat_all')
                break
            case '周':
                hall = await db.hGetAll('msgStat_week')
                break
            case '月':
                hall = await db.hGetAll('msgStat_month')
                break
            case '日':
                hall = await db.hGetAll('msgStat_day')
                break
            default:
                return
        }
        let res = `${msg.split(' ')[1]}发言排行榜\n总发言数 ${hall[0]}`
        delete hall[0]
        let arr = Object.keys(hall).map((x) => [x, hall[x]])
        arr.sort((x, y) => Number(y[1]) - Number(x[1]))
        
        for (let i = 0; i < 10; i++) {
            if (!arr[i]) break
            const { data } = (await axios({
                method: 'POST',
                baseURL: conf.cqhttp.baseURL,
                url: '/get_group_member_info',
                data: {
                    group_id: group,
                    user_id: arr[i][0]
                }
            })).data
            res += '\n'
            if (data.title) res += `[${data.title}]`
            res += `${data.card || data.nickname} ${arr[i][1]}条`
        }
        sender.sendGroupMessage(group, res)
    }
}