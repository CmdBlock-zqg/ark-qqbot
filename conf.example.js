module.exports = {
    cqhttp: {
        baseURL: 'http://127.0.0.1:5700/',
        listen: '5701'
    },
    id: 0000000000,
    weibo: {
        broadcast: {
            groups: [0000000000, 0000000000],
            users: [0000000000]
        },
        userIdList: ["6279793937", "6441489862", "7499841383"],
        cookie: "[微博cookie]"
    },
    intervals: {
        updateGameData: 6 * 3600 * 1000,
        updateWeibo: 180 * 1000
    },
    handlers: {
        0: [], // 私聊
        1083320850: ['common'],
        907815252: ['common']
    }
}