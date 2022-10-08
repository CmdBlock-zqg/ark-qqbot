const spiders = {
    'weibo': require('./weibo'),
    'sirenNews': require('./sirenNews'),
}

module.exports = () => {
    for (let i of Object.keys(spiders)) {
        spiders[i]()
    }
}