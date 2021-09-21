const conf = require('../conf')

const handlers = {
    'common': require('./common'),
    'gacha': require('./gacha'),
    'msgStat': require('./msgStat')
}

module.exports = (msg, user, group, type) => {
    if (type === 'private') {
        for (let i of conf.handlers[0]) {
            handlers[i](msg, user, group, type)
        }
    } else if (type === 'group') {
        for (let i of conf.handlers[group]) {
            handlers[i](msg, user, group, type)
        }
    }
}