const arkData = require('../arkData')
const sender = require('../sender')
const conf = require('../conf')

const handlers = {
    '##帮助': (msg, user) => {
        return `使用帮助
查询今日过生日的干员 ##生日
查询升级花费 ##升级
查询干员精英化材料 ##精英化
查询干员技能升级材料 ##技能
查询干员专精材料 ##专精
查询材料刷取 ##刷取
查询材料合成 ##合成
假装抽卡 ##十连
随机选择 ##选择
芜湖 ##芜湖`
    },
    '##生日': (msg, user) => {
        let date = new Date(Date.now())
        let key = `${date.getMonth() + 1}月${date.getDate()}日`
        let arr = arkData.getBirthdayOps(key)
        if (arr.length === 0) {
            return `今天没有过生日的干员！
生日未公开的干员：${arkData.getBirthdayOps('未公开').join(' ')}
生日未知的干员：${arkData.getBirthdayOps('未知').join(' ')}
本人表示遗忘生日的干员：${arkData.getBirthdayOps('本人表示遗忘').join(' ')}`
        } else {
            return `今天过生日的干员：
${arr.join(' ')}`
        }
    },
    '##升级': (msg, user) => {
        let arr = msg.split(' ')
        let m = Math.floor(Number(arr[1])),
            a = Math.floor(Number(arr[2])),
            b = Math.floor(Number(arr[3])),
            c = Math.floor(Number(arr[4])),
            d = Math.floor(Number(arr[5]))
        if (isNaN(m) || isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
            return `指令格式：
##升级 [稀有度] [起始精英化等级] [起始等级] [目标精英化等级] [目标等级]
如：##升级 6 1 1 2 90`
        }
        let x = arkData.getUpgradeCost(m, a, b),
            y = arkData.getUpgradeCost(m, c, d)
        if (x === false || y === false) return `数值错误`
        return `${m} 星干员从精${a} ${b}级升级到精${c} ${d}级花费(不含精英化)
龙门币：${ y.gold - x.gold }
经验：${ y.exp - x.exp }(相当于${ Math.ceil((y.exp - x.exp) / 1000) }个中级作战记录)`
    },
    '##芜湖': (msg, user) => {
        return '芜湖！'
    },
    '##精英化': (msg, user) => {
        let arr = msg.split(' ')
        if (arr.length !== 2) {
            return `指令格式：
##精英化 [干员代号]
如：##精英化 塞雷娅`
        }
        let res = arkData.getEvolveMtl(arr[1])
        if (res === false) {
            return `干员${arr[1]}不存在`
        }
        if (res.length === 0) {
            return `干员${arr[1]}无精英化`
        }
        let res_str = `干员${arr[1]}精英化材料`
        for (let i = 0; i < res.length; i++) res_str += `\n精英化${i + 1}：${res[i]}`
        return res_str
    },
    '##技能': (msg, user) => {
        let arr = msg.split(' ')
        if (arr.length !== 2) {
            return `指令格式：
##技能 [干员代号]
如：##技能 塞雷娅`
        }
        let res = arkData.getAllSkillLvlup(arr[1])
        if (res === false) {
            return `干员${arr[1]}不存在`
        }
        if (res.length === 0) {
            return `干员${arr[1]}无技能`
        }
        let res_str = `干员${arr[1]}技能升级材料`
        for (let i = 0; i < res.length; i++) res_str += `\nLv${i + 1}->Lv${i + 2}：${res[i]}`
        return res_str
    },
    '##专精': (msg, user) => {
        let arr = msg.split(' ')
        if (arr.length !== 3 || isNaN(arr[2])) {
            return `指令格式：
##专精 [干员代号] [技能编号]
如：##专精 塞雷娅 3`
        }
        let res = arkData.getSkillMtl(arr[1], Math.floor(arr[2]))
        if (res === false) {
            return `干员${arr[1]}不存在`
        }
        if (res.length === 0) {
            return `干员${arr[1]}无${Math.floor(arr[2])}技能`
        }
        let res_str = `干员${arr[1]}${Math.floor(arr[2])}技能专精材料`
        for (let i = 0; i < res.length; i++) res_str += `\n专${i}->专${i + 1}：${res[i]}`
        return res_str
    },
    '##刷取': (msg, user) => {
        return '材料一图流[CQ:image,file=https://cmdblockzqg.gitee.io/static/SL.png]'
    },
    '##合成': (msg, user) => {
        let arr = msg.split(' ')
        if (arr.length !== 2) {
            return `指令格式：
##合成 [干员代号]
如：##合成 D32钢`
        }
        let res = arkData.getFormula(arr[1])
        if (res === false) {
            return `材料${arr[1]}不存在`
        }
        if (res.length === 0) {
            return `材料${arr[1]}无法合成`
        }
        return `材料${arr[1]}合成配方\n${res}`
    },
    '##十连': (msg, user) => {
        return `该功能由于群友滥用 正在整改`
    },
    '##选择': (msg, user) => {
        let arr = msg.split(' ')
        if (arr.length === 1) {
            return `指令格式：
##选择 [空格隔开的一组词语]
如：##选择 玩方舟 玩元气
`
        }
        return arr[Math.floor(Math.random() * (arr.length - 1)) + 1]
    }
}

module.exports = (msg, user, group, type) => {
    if (msg.indexOf('##') !== 0) return
    let res
    for (let i of Object.keys(handlers)) {
        if (msg.indexOf(i) === 0) {
            res = handlers[i](msg, user)
            break
        }
    }
    if (!res) return
    if (typeof(res) === 'string') {
        sender.sendGroupMessage(group, res)
    } else {
        sender.sendGroupForwardMessage(group, res)
    }
}