const { default: axios } = require('axios')

const conf = require('./conf')

let queue = []

setInterval(() => {
    const x = queue.shift()
    if (!x) return
    axios({
        method: 'POST',
        baseURL: conf.cqhttp.baseURL,
        url: '/send_group_msg',
        data: {
            user_id: x.group,
            message: x.msg,
            group_id: x.group
        }
    })
}, 800)

module.exports = {
    sendPrivateMessage: async (user, msg, group) => {
        if (typeof(msg) === 'string') {
            await axios({
                method: 'POST',
                baseURL: conf.cqhttp.baseURL,
                url: '/send_private_msg',
                data: {
                    user_id: user,
                    message: msg,
                    group_id: group
                }
            })
        } else {
            for (let i of msg) {
                await axios({
                    method: 'POST',
                    baseURL: conf.cqhttp.baseURL,
                    url: '/send_private_msg',
                    data: {
                        user_id: user,
                        message: i,
                        group_id: group
                    }
                })
            }
        }
    },
    sendGroupMessage: async (group, msg) => {
        if (typeof(msg) === 'string') {
            queue.push({
                group: group,
                msg: msg
            })
        } else {
            for (let i of msg) {
                queue.push({
                    group: group,
                    msg: i
                })
            }
        }
    },
    sendGroupForwardMessage: async (group, msg) => {
        /*
        msg {
            uin: 
            name:
            content:
        }
        */
       try {
           await axios({
                method: 'POST',
                baseURL: conf.cqhttp.baseURL,
                url: '/send_group_forward_msg',
                data: {
                    group_id: group,
                    messages: msg.map((x) => {
                        return {
                            type: 'node',
                            data: x
                        }
                    })
                }
            })
       } catch(err) {
           console.log(err)
       }
        
    },
    setGroupBan: async (group, enable) => {
        await axios({
            method: 'POST',
            baseURL: conf.cqhttp.baseURL,
            url: '/set_group_whole_ban',
            data: {
                group_id: group,
                enable: enable//  ? 'true' : 'false'
            }
        })
    },
    canReach: async (url) => {
        try {
            await axios.get(url)
        } catch {
            return false
        }
        return true
    }
}