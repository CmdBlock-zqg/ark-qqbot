const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)
const fs = require('fs')

const conf = require('./conf')
const updateWeibo = require('./weibo')

module.exports = () => {
    setInterval(updateData, conf.intervals.updateGameData)
    setInterval(updateWeibo, conf.intervals.updateWeibo)
    updateData()
    updateWeibo()
}

const updateData = async () => {
    await exec('git pull', { cwd: '../ArknightsGameData/' })
    require('./arkData.js').update()
}