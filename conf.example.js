module.exports = {
    cqhttp: {
        baseURL: 'http://127.0.0.1:5700/',
        listen: '5701'
    },
    id: 0, // qq号
    group: 0, // 主群号
    ban: [],
    arkData: {
        updateInterval: 6 * 3600 * 1000
    },
    weibo: {
        broadcast: {
            groups: [0, 0],
            users: [0]
        },
        userIdList: ["6279793937", "6441489862", "7499841383", "7745672941"],
        cookie: "weibo cookie",
        updateInterval: 60 * 1000
    },
    sirenNews: {
        broadcast: {
            groups: [0, 0],
            users: [0]
        },
        updateInterval: 180 * 1000
    },
    gacha: {
        maxTime: 3
    },
    msgStat: {
        group: 0
    },
    handlers: {
        0: [],
        0: ['common', 'gacha', 'msgStat'],
        0: ['common', 'gacha', 'msgStat'],
        0: ['common', 'gacha']
    }
}