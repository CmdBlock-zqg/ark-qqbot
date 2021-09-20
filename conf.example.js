module.exports = {
    cqhttp: {
        baseURL: 'http://127.0.0.1:5700/',
        listen: '5701'
    },
    id: 00000000, // 机器人qq
    ban: [],
    weibo: {
        broadcast: {
            groups: [000000000, 111111111], // 广播群号
            users: [222222222222] // 广播私聊
        },
        userIdList: ["6279793937", "6441489862", "7499841383"], // 微博用户id
        cookie: "微博cookie"
    },
    intervals: {
        updateGameData: 6 * 3600 * 1000,
        updateWeibo: 180 * 1000
    },
    gacha: {
        maxTime: 3
    },
    handlers: {
        0: [], // 私聊
        1111111111: ['common', 'gacha'],
        22222222222: ['common', 'gacha']
    }
}