module.exports = {
    cqhttp: {
        baseURL: 'http://127.0.0.1:5700/',
        listen: '5701'
    },
    groups: [111111111, 22222222],
    admin: 333333333,
    weibo: {
        userIdList: ["6279793937", "6441489862", "7499841383"],
        cookie: "[微博cookie]"
    },
    intervals: {
        updateGameData: 6 * 3600 * 1000,
        updateWeibo: 180 * 1000
    }
}