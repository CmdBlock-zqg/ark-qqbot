const schedule = require('node-schedule')

const conf = require('../conf')
const sender = require('../sender')
const db = require('../db')

const stdGachaList = {
    3: [
        { name: '芬', time: 1556589600000 },
        { name: '香草', time: 1556589600000 },
        { name: '翎羽', time: 1556589600000 },
        { name: '玫兰莎', time: 1556589600000 },
        { name: '卡缇', time: 1556589600000 },
        { name: '米格鲁', time: 1556589600000 },
        { name: '克洛丝', time: 1556589600000 },
        { name: '炎熔', time: 1556589600000 },
        { name: '芙蓉', time: 1556589600000 },
        { name: '安赛尔', time: 1556589600000 },
        { name: '史都华德', time: 1556589600000 },
        { name: '梓兰', time: 1556589600000 },
        { name: '空爆', time: 1558576800000 },
        { name: '月见夜', time: 1559181600000 },
        { name: '泡普卡', time: 1562659200000 },
        { name: '斑点', time: 1562659200000 }
    ],
    4:[
        { name: '夜烟', time: 1556589600000 },
        { name: '远山', time: 1556589600000 },
        { name: '杰西卡', time: 1556589600000 },
        { name: '流星', time: 1556589600000 },
        { name: '白雪', time: 1556589600000 },
        { name: '清道夫', time: 1556589600000 },
        { name: '红豆', time: 1556589600000 },
        { name: '杜宾', time: 1556589600000 },
        { name: '缠丸', time: 1556589600000 },
        { name: '霜叶', time: 1556589600000 },
        { name: '慕斯', time: 1556589600000 },
        { name: '砾', time: 1556589600000 },
        { name: '暗索', time: 1556589600000 },
        { name: '末药', time: 1556589600000 },
        { name: '调香师', time: 1556589600000 },
        { name: '角峰', time: 1556589600000 },
        { name: '蛇屠箱', time: 1556589600000 },
        { name: '古米', time: 1556589600000 },
        { name: '深海色', time: 1556589600000 },
        { name: '地灵', time: 1556589600000 },
        { name: '阿消', time: 1556589600000 },
        { name: '猎蜂', time: 1559181600000 },
        { name: '格雷伊', time: 1562659200000 },
        { name: '苏苏洛', time: 1566892800000 },
        { name: '桃金娘', time: 1568102400000 },
        { name: '红云', time: 1571126400000 },
        { name: '梅', time: 1574150400000 },
        { name: '安比尔', time: 1577174400000 },
        { name: '宴', time: 1584432000000 },
        { name: '刻刀', time: 1587456000000 },
        { name: '波登可', time: 1592467200000 },
        { name: '卡达', time: 1594281600000 },
        { name: '孑', time: 1597132800000 },
        { name: '酸糖', time: 1598342400000 },
        { name: '芳汀', time: 1600934400000 },
        { name: '泡泡', time: 1602748800000 },
        { name: '杰克', time: 1604217600000 },
        { name: '松果', time: 1608192000000 },
        { name: '豆苗', time: 1609833600000 },
        { name: '深靛', time: 1622534400000 },
        { name: '罗比菈塔', time: 1631865600000 }
    ],
    5:[
        { name: '白面鸮', time: 1556589600000 },
        { name: '凛冬', time: 1556589600000 },
        { name: '德克萨斯', time: 1556589600000 },
        { name: '芙兰卡', time: 1556589600000 },
        { name: '拉普兰德', time: 1556589600000 },
        { name: '幽灵鲨', time: 1556589600000 },
        { name: '蓝毒', time: 1556589600000 },
        { name: '白金', time: 1556589600000 },
        { name: '陨星', time: 1556589600000 },
        { name: '天火', time: 1556589600000 },
        { name: '梅尔', time: 1556589600000 },
        { name: '赫默', time: 1556589600000 },
        { name: '华法琳', time: 1556589600000 },
        { name: '临光', time: 1556589600000 },
        { name: '红', time: 1556589600000 },
        { name: '雷蛇', time: 1556589600000 },
        { name: '可颂', time: 1556589600000 },
        { name: '普罗旺斯', time: 1556589600000 },
        { name: '守林人', time: 1556589600000 },
        { name: '崖心', time: 1556589600000 },
        { name: '初雪', time: 1556589600000 },
        { name: '真理', time: 1556589600000 },
        { name: '空', time: 1556589600000 },
        { name: '狮蝎', time: 1556589600000 },
        { name: '食铁兽', time: 1556589600000 },
        { name: '夜魔', time: 1559181600000 },
        { name: '诗怀雅', time: 1562659200000 },
        { name: '格劳克斯', time: 1566892800000 },
        { name: '星极', time: 1568102400000 },
        { name: '送葬人', time: 1571126400000 },
        { name: '槐琥', time: 1574150400000 },
        { name: '苇草', time: 1575964800000 },
        { name: '布洛卡', time: 1575964800000 },
        { name: '灰喉', time: 1577174400000 },
        { name: '吽', time: 1579161600000 },
        { name: '惊蛰', time: 1582617600000 },
        { name: '慑砂', time: 1584432000000 },
        { name: '巫恋', time: 1587456000000 },
        { name: '极境', time: 1588320000000 },
        { name: '石棉', time: 1591084800000 },
        { name: '月禾', time: 1591084800000 },
        { name: '莱恩哈特', time: 1592467200000 },
        { name: '断崖', time: 1594281600000 },
        { name: '蜜蜡', time: 1595923200000 },
        { name: '贾维', time: 1595923200000 },
        { name: '安哲拉', time: 1597132800000 },
        { name: '燧石', time: 1598342400000 },
        { name: '四月', time: 1600934400000 },
        { name: '奥斯塔', time: 1602748800000 },
        { name: '絮雨', time: 1604217600000 },
        { name: '卡夫卡', time: 1608192000000 },
        { name: '爱丽丝', time: 1609833600000 },
        { name: '乌有', time: 1612512000000 },
        { name: '熔泉', time: 1618473600000 },
        { name: '赤冬', time: 1619856000000 },
        { name: '绮良', time: 1622534400000 },
        { name: '羽毛笔', time: 1627977600000 },
        { name: '桑葚', time: 1631865600000 }
    ],
    6: [
        { name: '能天使', time: 1556589600000 },
        { name: '推进之王', time: 1556589600000 },
        { name: '伊芙利特', time: 1556589600000 },
        { name: '艾雅法拉', time: 1556589600000 },
        { name: '安洁莉娜', time: 1556589600000 },
        { name: '闪灵', time: 1556589600000 },
        { name: '夜莺', time: 1556589600000 },
        { name: '星熊', time: 1556589600000 },
        { name: '塞雷娅', time: 1556589600000 },
        { name: '银灰', time: 1556589600000 },
        { name: '斯卡蒂', time: 1559181600000 },
        { name: '陈', time: 1562659200000 },
        { name: '黑', time: 1566892800000 },
        { name: '赫拉格', time: 1568102400000 },
        { name: '麦哲伦', time: 1571126400000 },
        { name: '莫斯提马', time: 1574150400000 },
        { name: '煌', time: 1577174400000 },
        { name: '阿', time: 1579161600000 },
        { name: '刻俄柏', time: 1582617600000 },
        { name: '风笛', time: 1584432000000 },
        { name: '傀影', time: 1587456000000 },
        { name: '温蒂', time: 1588320000000 },
        { name: '早露', time: 1592467200000 },
        { name: '铃兰', time: 1594281600000 },
        { name: '棘刺', time: 1597132800000 },
        { name: '森蚺', time: 1598342400000 },
        { name: '史尔特尔', time: 1600934400000 },
        { name: '瑕光', time: 1602748800000 },
        { name: '泥岩', time: 1604217600000 },
        { name: '山', time: 1608192000000 },
        { name: '空弦', time: 1609833600000 },
        { name: '嵯峨', time: 1612512000000 },
        { name: '异客', time: 1618473600000 },
        { name: '凯尔希', time: 1619856000000 },
        { name: '卡涅利安', time: 1622534400000 },
        { name: '帕拉斯', time: 1625212800000 },
        { name: '水月', time: 1627977600000 },
        { name: '琴柳', time: 1631865600000 }
    ]
}

// type: std lim
let gachas = [
    {
        name: '小丘上的眠柳',
        time: 1631865600000,
        up: {
            6: ['琴柳'],
            5: ['桑葚', '雷蛇'],
            4: ['罗比菈塔']
        },
        upRate: {
            6: 50,
            5: 50,
            4: 20
        },
        type: 'std'
    },
    {
        name: '轮换池',
        time: 1631779200000,
        up: {
            6: ['空弦', '温蒂'],
            5: ['拉普兰德', '格劳克斯', '空']
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
    pool.all = {}
    for (let r = 6; r >= 3; r--) {
        pool.all[r] = []
        for (let op of stdGachaList[r]) {
            if (op.time <= pool.time) {
                pool.all[r].push(op.name)
            }
        }
    }
}

const getRand = (l, r) => {
    return Math.floor(Math.random() * (r - l + 1)) + l
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
        await db.hSetNX('gacha_time_left', user, String(conf.gacha.maxTime))
        await db.hSetNX('gacha_time_no_6_std', user, '0')
        await db.hSetNX('gacha_time_no_6_lim', user, '0')
        await db.hSetNX('gacha_stat', user, JSON.stringify({ tot: 0, nb: 0, noup: 0 }))
        const stat = JSON.parse(await db.hGet('gacha_stat', user))
        sender.sendGroupMessage(group, `[CQ:at,qq=${user}]
今日剩余十连次数：${await db.hGet('gacha_time_left', user)}
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

        await db.hSetNX('gacha_time_left', user, String(conf.gacha.maxTime))
        if (await db.hGet('gacha_time_left', user) === '0') {
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
                    op = pool.all[6][getRand(0, pool.all[6].length - 1)]
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

        await db.hIncrBy('gacha_time_left', user, -1)
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