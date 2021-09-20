const promisify = require('util').promisify
const exec = promisify(require('child_process').exec)

const conf = require('./conf')
const updateWeibo = require('./weibo')
const updateArkData = require('./arkData.js').update

module.exports = () => {
    setInterval(updateData, conf.intervals.updateGameData)
    setInterval(updateWeibo, conf.intervals.updateWeibo)
    updateArkData()
    updateData()
    updateWeibo()
}

const updateData = async () => {
    await exec('git pull', { cwd: '../ArknightsGameData/' })
    updateArkData()
}