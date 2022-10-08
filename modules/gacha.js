const schedule = require('node-schedule')

const conf = require('../conf')
const sender = require('../sender')
const db = require('../db')

const {
    randomInt
} = require('crypto')

const stdGachaList = {
    3: [
        '芬',
        '香草',
        '翎羽',
        '玫兰莎',
        '卡缇',
        '米格鲁',
        '克洛丝',
        '炎熔',
        '芙蓉',
        '安赛尔',
        '史都华德',
        '梓兰',
        '空爆',
        '月见夜',
        '泡普卡',
        '斑点',
    ],
    4:[
        '夜烟',
        '远山',
        '杰西卡',
        '流星',
        '白雪',
        '清道夫',
        '红豆',
        '杜宾',
        '缠丸',
        '霜叶',
        '慕斯',
        '砾',
        '暗索',
        '末药',
        '调香师',
        '角峰',
        '蛇屠箱',
        '古米',
        '深海色',
        '地灵',
        '阿消',
        '猎蜂',
        '格雷伊',
        '苏苏洛',
        '桃金娘',
        '红云',
        '梅', 
        '安比尔',
        '宴',
        '刻刀',
        '波登可',
        '卡达',
        '孑',
        '酸糖',
        '芳汀',
        '泡泡',
        '杰克',
        '松果',
        '豆苗',
        '深靛',
        '罗比菈塔',
        '褐果'
    ],
    5:[
        '白面鸮',
        '凛冬',
        '德克萨斯',
        '芙兰卡',
        '拉普兰德',
        '幽灵鲨',
        '蓝毒',
        '白金',
        '陨星',
        '天火',
        '梅尔',
        '赫默',
        '华法琳',
        '临光',
        '红',
        '雷蛇',
        '可颂',
        '普罗旺斯',
        '守林人',
        '崖心', 
        '初雪', 
        '真理', 
        '空', 
        '狮蝎',
        '食铁兽',
        '夜魔',
        '诗怀雅',
        '格劳克斯',
        '星极',
        '送葬人',
        '槐琥',
        '苇草',
        '布洛卡',
        '灰喉',
        '吽',
        '惊蛰',
        '慑砂',
        '巫恋',
        '极境',
        '石棉',
        '月禾',
        '莱恩哈特',
        '断崖',
        '蜜蜡',
        '贾维',
        '安哲拉',
        '燧石',
        '四月',
        '奥斯塔',
        '絮雨',
        '卡夫卡',
        '爱丽丝',
        '乌有',
        '熔泉',
        '赤冬',
        '绮良',
        '羽毛笔',
        '桑葚',
        '灰毫',
        '蚀清',
        '极光',
        '夜半',
        '夏栎',
        '风丸',
        '洛洛',
        '掠风',
        '濯尘芙蓉',
        '承曦格雷伊',
        '晓歌'
    ],
    6: [
        '能天使',
        '推进之王',
        '伊芙利特',
        '艾雅法拉',
        '安洁莉娜',
        '闪灵',
        '夜莺',
        '星熊',
        '塞雷娅',
        '银灰',
        '斯卡蒂',
        '陈',
        '黑',
        '赫拉格',
        '麦哲伦',
        '莫斯提马',
        '煌',
        '阿',
        '刻俄柏',
        '风笛',
        '傀影',
        '温蒂',
        '早露',
        '铃兰',
        '棘刺',
        '森蚺',
        '史尔特尔',
        '瑕光',
        '泥岩',
        '山',
        '空弦',
        '嵯峨',
        '异客',
        '凯尔希',
        '卡涅利安',
        '帕拉斯',
        '水月',
        '琴柳',
        '远牙',
        '焰尾',
        '灵知',
        '老鲤',
        '澄闪',
        '菲亚梅塔',
        '号角',
        '艾丽妮',
        '黑键',
        '多萝西',
        '鸿雪'
    ]
}

// type: std lim
let gachas = [
    /*
    {
        name: '[限定]巨斧与笔尖',
        up: {
            7: ['假日威龙陈'], // 5倍权值提升
            6: ['百炼嘉维尔', '鸿雪'],
            5: ['晓歌']
        },
        upRate: {
            6: 70,
            5: 50,
            4: 20
        },
        type: 'lim'
    },
    */
    {
        name: '未曾起誓',
        up: {
            6: ['玛恩纳'],
            5: ['但书', '芙兰卡'],
        },
        upRate: {
            6: 50,
            5: 50,
            4: 20
        },
        type: 'std'
    },
    {
        name: '联合行动',
        up: {
            6: ['风笛', '卡涅利安', '麦哲伦', '异客'],
            5: ['乌有', '巫恋', '熔泉', '桑葚', '羽毛笔', '天火']
        },
        upRate: {
            6: 100,
            5: 100,
            4: 20
        },
        type: 'std'
    },
    {
        name: '轮换池',
        up: {
            6: ['早露', '斯卡蒂'],
            5: ['洛洛', '幽灵鲨', '绮良']
        },
        upRate: {
            6: 50,
            5: 50,
            4: 20
        },
        type: 'std'
    }
]

for (let pool of gachas) {
    pool.all = stdGachaList
}

const getRand = (l, r) => {
    // return Math.floor(Math.random() * (r - l + 1)) + l
    return randomInt(l, r + 1)
}

schedule.scheduleJob('0 0 4 * * *', async () => { // 每天凌晨4点
    await db.del('gacha_time_left')
})

module.exports = async (msg, user, group, type) => {
    if (msg.indexOf('##十连') !== 0) return
    let arr = msg.split(' ')
    if (msg.indexOf('##十连统计') === 0) arr = ['##十连', '统计']
    user = String(user)
    if (arr[1] === '统计') { // 输出统计
        await db.hSetNX('gacha_time_left', user + '_' + group, String(conf.gacha.maxTime))
        await db.hSetNX('gacha_time_no_6_std', user, '0')
        await db.hSetNX('gacha_time_no_6_lim', user, '0')
        await db.hSetNX('gacha_stat', user, JSON.stringify({ tot: 0, nb: 0, noup: 0 }))
        const stat = JSON.parse(await db.hGet('gacha_stat', user))
        sender.sendGroupMessage(group, `[CQ:at,qq=${user}]
今日剩余十连次数：${await db.hGet('gacha_time_left', user + '_' + group)}
连续未出六星次数（标准）：${await db.hGet('gacha_time_no_6_std', user)}
连续未出六星次数（限定）：${await db.hGet('gacha_time_no_6_lim', user)}
总十连次数：${stat.tot}
总六星个数：${stat.nb}
六星抽歪次数：${stat.noup}`
        )
    } else if (!isNaN(arr[1]) && gachas[Number(arr[1])]) { // 抽取
        const starText = {
            3: '★★★☆☆☆',
            4: '★★★★☆☆',
            5: '★★★★★☆',
            6: '★★★★★★',
        }

        await db.hSetNX('gacha_time_left', user + '_' + group, String(conf.gacha.maxTime))
        if (await db.hGet('gacha_time_left', user + '_' + group) === '0') {
            sender.sendGroupMessage(group, `[CQ:at,qq=${user}] 每日十连次数已用完`)
            return
        }
        
        const pool = gachas[Number(arr[1])] // 当前卡池
        await db.hSetNX('gacha_stat', user, JSON.stringify({ tot: 0, nb: 0, noup: 0 }))
        let stat = JSON.parse(await db.hGet('gacha_stat', user)) // 统计信息
        let resText = `[CQ:at,qq=${user}]` // 结果消息
        await db.hSetNX('gacha_time_no_6_' + pool.type, user, '0')
        let time = Number(await db.hGet('gacha_time_no_6_' + pool.type, user)) // 无六星次数
        stat.tot++

        for (let cnt = 0; cnt < 10; cnt++) {
            let chance = time <= 50 ? 2 : 2 + (time - 50) * 2
            if (getRand(0, 99) < chance) { // 抽到六星
                stat.nb++
                time = 0
                let op
                if (getRand(0, 99) < pool.upRate[6]) {
                    op = pool.up[6][getRand(0, pool.up[6].length - 1)]
                } else {
                    if (pool.type === 'std') {
                        op = pool.all[6][getRand(0, pool.all[6].length - 1)]
                    } else if (pool.type === 'lim') {
                        let tmpx = getRand(0, pool.all[6].length + pool.up[7].length * 5 - 1)
                        if (tmpx < pool.up[7].length * 5) {
                            op = pool.up[7][Math.floor(tmpx / 5)]
                        } else {
                            op = pool.all[6][tmpx - pool.up[7].length * 5]
                        }
                    }
                }
                resText += `\n${starText[6]} ${op}`
                stat.noup += Number(pool.up[6].indexOf(op) === -1)
                continue
            }
            time++
            const rnd = getRand(0, 97)
            const starMap = { 8: 5, 58: 4, 98: 3 }
            for (let k of Object.keys(starMap)) {
                if (rnd >= k) continue
                const r = starMap[k]
                let op
                if (pool.up[r] && getRand(0, 99) < pool.upRate[r]) {
                    op = pool.up[r][getRand(0, pool.up[r].length - 1)]
                } else {
                    op = pool.all[r][getRand(0, pool.all[r].length - 1)]
                }
                resText += `\n${starText[r]} ${op}`
                break
            }
        }

        await db.hIncrBy('gacha_time_left', user + '_' + group, -1)
        const t = {}
        t[user] = String(time)
        await db.hSet('gacha_time_no_6_' + pool.type, t)
        t[user] = JSON.stringify(stat)
        await db.hSet('gacha_stat', t)
        sender.sendGroupMessage(group, resText)

    } else { // 帮助
        let res = `##十连 统计：查看统计信息`
        for (let i = 0; i < gachas.length; i++) {
            res += `\n##十连 ${i}：抽取${gachas[i].name}`
        }
        sender.sendGroupMessage(group, res)
    }
}

/*
gacha_time_left
gacha_time_no_6_std
gacha_time_no_6_lim
stat { 统计信息
    total, 总十连次数
    nb, 六星个数
    noup, 歪次数
}
*/