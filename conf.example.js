module.exports = {
    cqhttp: {
        baseURL: 'http://127.0.0.1:5700/',
        listen: '5701'
    },
    id: 0000000000,
    ban: [],
    arkData: {
        updateInterval: 6 * 3600 * 1000
    },
    weibo: {
        broadcast: {
            groups: [0000000000, 0000000000],
            users: [0000000000]
        },
        userIdList: ["6279793937", "6441489862", "7499841383"],
        cookie: "微博cookie",
        updateInterval: 180 * 1000
    },
    sirenNews: {
        broadcast: {
            groups: [0000000000, 0000000000],
            users: [0000000000]
        },
        updateInterval: 180 * 1000
    },
    gacha: {
        maxTime: 3
    },
    msgStat: {
        admin: [0000000000, 0000000000],
        group: 0000000000
    },
    handlers: {
        0: [],
        0000000000: ['common', 'gacha', 'msgStat'],
        0000000000: ['common', 'gacha', 'msgStat']
    }
}